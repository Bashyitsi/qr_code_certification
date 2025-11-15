import jsPDF from 'jspdf'
import { Certificate } from '@/types/certificate'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * PDF Generator for KIGALI DEUTSCH ACADEMY Certificates
 * 2-page A4 portrait layout with German/English bilingual content
 */
export class PDFGenerator {
  // Colors matching the reference certificate
  private static readonly COLORS = {
    PRIMARY_TEXT: '#111111',
    DEEP_ACCENT: '#3A0F14',
    TABLE_HEADER_BG: '#E7E3DC',
    TABLE_ROW_BG: '#F4F2EE',
    BORDER: '#C9C4BC',
    PALE_BANNER: '#F4F3C2',
  }

  private static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  private static formatDateToGerman(dateStr: string | undefined): string {
    if (!dateStr) return '—'
    if (dateStr.includes('-')) {
      const [year, month, day] = dateStr.split('-')
      return `${day}.${month}.${year}`
    }
    return dateStr
  }

  /**
   * Main generator function
   * @param certificate - Certificate data
   * @returns Promise<ArrayBuffer>
   */
  static async generateCertificatePDF(
    certificate: Certificate
  ): Promise<ArrayBuffer> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    // Load logo from filesystem (server-side)
    let logoDataUrl: string | null = null
    try {
      const logoPath = join(process.cwd(), 'public', 'kda-logo.png')
      const logoBuffer = readFileSync(logoPath)
      const base64 = logoBuffer.toString('base64')
      logoDataUrl = `data:image/png;base64,${base64}`
      console.log('Logo loaded successfully from filesystem')
    } catch (err) {
      console.error('Logo failed to load:', err)
    }

    // PAGE 1: Certificate
    this.createPage1(pdf, certificate, pageWidth, pageHeight, logoDataUrl)

    // PAGE 2: Rating scale
    pdf.addPage()
    this.createPage2(pdf, certificate, pageWidth, pageHeight, logoDataUrl)

    return pdf.output('arraybuffer')
  }

  private static createPage1(
    pdf: jsPDF,
    certificate: Certificate,
    pageWidth: number,
    pageHeight: number,
    logoDataUrl: string | null = null
  ) {
    const margin = 15
    let yPos = margin + 10  // Add extra top margin before header

    const primaryColor = this.hexToRgb(this.COLORS.PRIMARY_TEXT)
    const accentColor = this.hexToRgb(this.COLORS.DEEP_ACCENT)
    const borderColor = this.hexToRgb(this.COLORS.BORDER)

    // ==================== HEADER ====================
    
    // Add KDA Logo to top right if available
    if (logoDataUrl) {
      try {
        pdf.addImage(logoDataUrl, pageWidth - 50, margin + 10, 35, 35)
      } catch (err) {
        // Logo failed to add, continue without it
        console.warn('Logo failed to add to Page 1:', err)
      }
    }
    
    // Title: KIGALI DEUTSCH ACADEMY (top left)
    pdf.setFontSize(26)
    pdf.setFont('helvetica', 'bold')

    const titleY = yPos
    let kigaliWidth = pdf.getTextWidth('KIGALI ')
    let deutschWidth = pdf.getTextWidth('DEUTSCH')
    let academyWidth = pdf.getTextWidth(' ACADEMY')
    let totalWidth = kigaliWidth + deutschWidth + academyWidth
    
    // Position at left side (not centered)
    let xPos = margin

    // "KIGALI " in primary color
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    pdf.text('KIGALI ', xPos, titleY)
    xPos += kigaliWidth

    // "DEUTSCH" in accent color
    pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b)
    pdf.text('DEUTSCH', xPos, titleY)
    xPos += deutschWidth

    // " ACADEMY" in primary color
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    pdf.text(' ACADEMY', xPos, titleY)

    yPos += 18

    // Certificate level and "DEUTSCH - ZERTIFIKAT" on same line (left-aligned)
    const certLevel = certificate.deutschlevel || 'A1'
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(255, 0, 0) // Red color
    
    const levelText = certLevel
    const dashText = ' - '
    const subtitleText = 'DEUTSCH - ZERTIFIKAT'
    
    let combinedXPos = margin
    pdf.text(levelText, combinedXPos, yPos)
    combinedXPos += pdf.getTextWidth(levelText + dashText)
    pdf.text(subtitleText, combinedXPos, yPos)

    yPos += 14

    // Level indicators: A1 A2 B1 B2 C1 C2 (colored based on achievement)
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    const levelSpacing = 20
    const levelStartX = margin
    
    levels.forEach((level, index) => {
      // Achieved level in black, others in red
      if (level === certLevel) {
        pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b) // Black
      } else {
        pdf.setTextColor(255, 0, 0) // Red
      }
      pdf.text(level, levelStartX + (index * levelSpacing), yPos)
    })

    yPos += 20

    yPos += 15

    // ==================== STUDENT INFO ====================

    const leftColX = margin + 15
    const rightColX = pageWidth / 2 + 10
    const valueCol = leftColX + 50
    const rightValueCol = rightColX + 50
    const lineSpacing = 10

    let leftYPos = yPos
    let rightYPos = yPos

    const addFieldLeft = (label: string, subLabel: string, value: string) => {
      // German label (bold, accent color)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b)
      pdf.text(label, leftColX, leftYPos)

      // Value
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      pdf.text(value, valueCol, leftYPos)

      leftYPos += 4

      // English sublabel (smaller, gray, italic)
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text(subLabel, leftColX, leftYPos)

      leftYPos += lineSpacing
    }

    const addFieldRight = (label: string, subLabel: string, value: string) => {
      // German label (bold, accent color)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b)
      pdf.text(label, rightColX, rightYPos)

      // Value
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      pdf.text(value, rightValueCol, rightYPos)

      rightYPos += 4

      // English sublabel (smaller, gray, italic)
      pdf.setFont('helvetica', 'italic')
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text(subLabel, rightColX, rightYPos)

      rightYPos += lineSpacing
    }

    // Left column
    addFieldLeft(
      'Vorname und Name',
      'First and Surname',
      certificate.recipient_name || '—'
    )

    addFieldLeft(
      'Geburtsdatum',
      'Date of Birth',
      this.formatDateToGerman(certificate.geburtstag)
    )

    addFieldLeft(
      'Geburtsort',
      'Place of Birth',
      certificate.geburtsort || '—'
    )

    // Right column
    addFieldRight(
      'Prüfungsdatum',
      'Exam date',
      this.formatDateToGerman(certificate.pruefungsdatum)
    )

    addFieldRight(
      'Prüfungsort',
      'Place of exam',
      certificate.pruefungsort || '—'
    )

    yPos = Math.max(leftYPos, rightYPos) + 8

    // ==================== RESULTS TABLE ====================

    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b)
    pdf.text('Ergebnis - Results', leftColX, yPos)
    yPos += 10

    // Table structure (3 columns: Skill, Attained score, Max score)
    const tableX = leftColX
    const tableWidth = pageWidth - 2 * margin - 30
    const col1 = 70  // Skill name
    const col2 = 50  // Score achieved
    const col3 = 40  // Max score
    const rowHeight = 11

    const headerBg = this.hexToRgb(this.COLORS.TABLE_HEADER_BG)
    const rowBg = this.hexToRgb(this.COLORS.TABLE_ROW_BG)

    // Header row
    pdf.setFillColor(headerBg.r, headerBg.g, headerBg.b)
    pdf.rect(tableX, yPos, col1 + col2 + col3, rowHeight, 'F')

    pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
    pdf.setLineWidth(0.3)
    pdf.rect(tableX, yPos, col1 + col2 + col3, rowHeight)

    // Header text
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(9)
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    
   
    pdf.text('Erreichte Punktstand', tableX + col1 + 3, yPos + 4)
    pdf.text('maximale Punktzahl', tableX + col1 + col2 + 3, yPos + 4)
    
    pdf.setFontSize(8)
    pdf.text('Attained score', tableX + col1 + 3, yPos + 8)
    pdf.text('maximum score', tableX + col1 + col2 + 3, yPos + 8)

    yPos += rowHeight

    // Data rows - all 4 skills (Hören, Lesen, Schreiben, Sprechen)
    const skills = [
      { de: 'Hören', en: 'Listening', score: certificate.hoeren || 0 },
      { de: 'Lesen', en: 'Reading', score: certificate.lesen || 0 },
      { de: 'Schreiben', en: 'Writing', score: certificate.schreiben || 0 },
      { de: 'Sprechen', en: 'Speaking', score: certificate.sprechen || 0 },
    ]

    skills.forEach((skill, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        pdf.setFillColor(rowBg.r, rowBg.g, rowBg.b)
        pdf.rect(tableX, yPos, col1 + col2 + col3, rowHeight, 'F')
      }

      // Row border
      pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
      pdf.rect(tableX, yPos, col1 + col2 + col3, rowHeight)

      // Content
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)

      pdf.text(`${skill.de}- ${skill.en}`, tableX + 3, yPos + 7)
      pdf.text(String(skill.score), tableX + col1 + 20, yPos + 7)
      pdf.text('100', tableX + col1 + col2 + 15, yPos + 7)

      yPos += rowHeight
    })

    yPos += 12

    // ==================== FOOTER WITH QR CODE BELOW TABLE ====================

    // Location, date on the left (first line)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(10)
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    
    pdf.text('Kigali,', margin, yPos)
    pdf.text(this.formatDateToGerman(certificate.pruefungsdatum), margin + 25, yPos)
    
    yPos += 6
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Ort Datum - Location, date', margin, yPos)

    yPos += 4  // Reduced space between date and verification text

    // QR Code on right side, positioned parallel with verification text
    const qrSize = 50
    const qrX = pageWidth - margin - qrSize
    const qrY = yPos

    if (certificate.qr_code_url) {
      try {
        pdf.addImage(certificate.qr_code_url, 'PNG', qrX, qrY, qrSize, qrSize)
      } catch (e) {
        // Fallback
        pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
        pdf.rect(qrX, qrY, qrSize, qrSize)
      }
    }

    // Verification text on left - PARALLEL WITH QR CODE
    pdf.setFontSize(9)
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    pdf.text(`Please verify this certificate with code:`, margin, qrY + 8)
    
    // Certificate code BELOW the verification text
    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.text(certificate.certificate_code || '—', margin, qrY + 16)
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    pdf.text(`Visit: certificate.kigalideutschacademy.com`, margin, qrY + 28)
    pdf.text(`Email: deutschconnectacademy@gmail.com`, margin, qrY + 33)
    pdf.text(`Or scan the QR code`, margin, qrY + 38)
  }

  private static createPage2(
    pdf: jsPDF,
    certificate: Certificate,
    pageWidth: number,
    pageHeight: number,
    logoDataUrl: string | null = null
  ) {
    const margin = 15
    let yPos = margin + 10  // Add extra top margin before header

    const primaryColor = this.hexToRgb(this.COLORS.PRIMARY_TEXT)
    const accentColor = this.hexToRgb(this.COLORS.DEEP_ACCENT)
    const borderColor = this.hexToRgb(this.COLORS.BORDER)

    // ==================== HEADER ====================
    
    // Add KDA Logo to top right if available
    if (logoDataUrl) {
      try {
        pdf.addImage(logoDataUrl, pageWidth - 50, margin + 10, 35, 35)
      } catch (err) {
        // Logo failed to add, continue without it
        console.warn('Logo failed to add to Page 2:', err)
      }
    }
    
    // Title: KIGALI DEUTSCH ACADEMY (top left) - LARGER
    pdf.setFontSize(28)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    pdf.text('KIGALI DEUTSCH ACADEMY', margin, yPos)
    yPos += 15

    // Rating scale title
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(accentColor.r, accentColor.g, accentColor.b)
    const tableTitle = 'Bewertungsskala – Rating Scale'
    const titleWidth = pdf.getTextWidth(tableTitle)
    pdf.text(tableTitle, (pageWidth - titleWidth) / 2, yPos)
    yPos += 12

    // Table
    const tableWidth = 150
    const tableX = (pageWidth - tableWidth) / 2
    const col1Width = 75
    const col2Width = 75
    const rowHeight = 12

    const headerBg = this.hexToRgb(this.COLORS.TABLE_HEADER_BG)
    const rowBg = this.hexToRgb(this.COLORS.TABLE_ROW_BG)

    // Header
    pdf.setFillColor(headerBg.r, headerBg.g, headerBg.b)
    pdf.rect(tableX, yPos, tableWidth, rowHeight, 'F')
    pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
    pdf.rect(tableX, yPos, tableWidth, rowHeight)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
    pdf.text('PUNKTE · POINTS', tableX + 5, yPos + 8)
    pdf.text('PRÄDIKAT · RATING', tableX + col1Width + 5, yPos + 8)

    yPos += rowHeight

    // Rows
    const ratings = [
      { points: '100 – 90', rating: 'SEHR GUT · VERY GOOD' },
      { points: '89 – 80', rating: 'GUT · GOOD' },
      { points: '79 – 70', rating: 'BEFRIEDIGEND · SATISFACTORY' },
      { points: '69 – 60', rating: 'AUSREICHEND · PASS' },
      { points: '59 – 0', rating: 'NICHT BESTANDEN · FAIL' },
    ]

    ratings.forEach((row, index) => {
      if (index % 2 === 0) {
        pdf.setFillColor(rowBg.r, rowBg.g, rowBg.b)
        pdf.rect(tableX, yPos, tableWidth, rowHeight, 'F')
      }

      pdf.setDrawColor(borderColor.r, borderColor.g, borderColor.b)
      pdf.rect(tableX, yPos, tableWidth, rowHeight)

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
      pdf.text(row.points, tableX + 5, yPos + 8)
      pdf.text(row.rating, tableX + col1Width + 5, yPos + 8)

      yPos += rowHeight
    })
  }

  static downloadPDF(arrayBuffer: ArrayBuffer, filename: string) {
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
