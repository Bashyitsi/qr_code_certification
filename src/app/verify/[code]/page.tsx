import { CertificateService } from '@/services/certificate-service'
import { Certificate } from '@/types/certificate'
import { XCircle } from 'lucide-react'

// Helper to format PostgreSQL date to German format
function formatDateToGerman(dateStr: string | undefined): string {
  if (!dateStr) return '—'
  if (dateStr.includes('-')) {
    const [year, month, day] = dateStr.split('-')
    return `${day}.${month}.${year}`
  }
  return dateStr
}

interface Props {
  params: Promise<{
    code: string
  }>
}

export default async function CertificateVerificationPage({ params }: Props) {
  const { code } = await params
  const certificate = await CertificateService.getCertificateByCode(code)

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificate Not Found</h1>
          <p className="text-gray-600 mb-4">
            The certificate code you&apos;re looking for doesn&apos;t exist or has been deactivated.
          </p>
          <p className="text-sm text-gray-500">Code: {code}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh', fontFamily: 'helvetica, arial, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* PAGE 1: CERTIFICATE */}
        <div style={{ backgroundColor: 'white', padding: 'clamp(20px, 5vw, 60px)', marginBottom: '0', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* HEADER: Title at top left */}
          <div style={{ marginBottom: 'clamp(10px, 2vh, 20px)' }}>
            <div style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 'bold', textAlign: 'left' }}>
              <span style={{ color: '#111111' }}>KIGALI </span>
              <span style={{ color: '#3A0F14' }}>DEUTSCH</span>
              <span style={{ color: '#111111' }}> ACADEMY</span>
            </div>
          </div>

          {/* Spacing between header and content */}
          <div style={{ marginBottom: '15px' }}></div>

          {/* Certificate Level and DEUTSCH - ZERTIFIKAT on same line - top left */}
          <div style={{ marginBottom: '20px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: 'red' }}>
            {certificate.deutschlevel || 'A1'} - DEUTSCH - ZERTIFIKAT
          </div>

          {/* Level Indicators - top left */}
          <div style={{ marginBottom: '30px', textAlign: 'left', fontSize: '18px', fontWeight: 'bold', letterSpacing: '10px' }}>
            {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level) => (
              <span key={level} style={{ color: level === certificate.deutschlevel ? '#111111' : 'red', marginRight: '5px' }}>
                {level}
              </span>
            ))}
          </div>

          {/* STUDENT INFO SECTION */}
          <div style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            {/* Left Column */}
            <div>
              {/* Name */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#3A0F14', marginBottom: '2px' }}>
                  Vorname und Name
                </div>
                <div style={{ fontSize: '11px', color: '#111111', marginBottom: '2px', fontWeight: 'normal' }}>
                  {certificate.recipient_name}
                </div>
                <div style={{ fontSize: '8px', color: '#666666', fontStyle: 'italic' }}>
                  First and Surname
                </div>
              </div>

              {/* Birth Date */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#3A0F14', marginBottom: '2px' }}>
                  Geburtsdatum
                </div>
                <div style={{ fontSize: '11px', color: '#111111', marginBottom: '2px', fontWeight: 'normal' }}>
                  {formatDateToGerman(certificate.geburtstag)}
                </div>
                <div style={{ fontSize: '8px', color: '#666666', fontStyle: 'italic' }}>
                  Date of Birth
                </div>
              </div>

              {/* Birth Place */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#3A0F14', marginBottom: '2px' }}>
                  Geburtsort
                </div>
                <div style={{ fontSize: '11px', color: '#111111', marginBottom: '2px', fontWeight: 'normal' }}>
                  {certificate.geburtsort || '—'}
                </div>
                <div style={{ fontSize: '8px', color: '#666666', fontStyle: 'italic' }}>
                  Place of Birth
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Exam Date */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#3A0F14', marginBottom: '2px' }}>
                  Prüfungsdatum
                </div>
                <div style={{ fontSize: '11px', color: '#111111', marginBottom: '2px', fontWeight: 'normal' }}>
                  {formatDateToGerman(certificate.pruefungsdatum)}
                </div>
                <div style={{ fontSize: '8px', color: '#666666', fontStyle: 'italic' }}>
                  Exam date
                </div>
              </div>

              {/* Exam Place */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#3A0F14', marginBottom: '2px' }}>
                  Prüfungsort
                </div>
                <div style={{ fontSize: '11px', color: '#111111', marginBottom: '2px', fontWeight: 'normal' }}>
                  {certificate.pruefungsort || '—'}
                </div>
                <div style={{ fontSize: '8px', color: '#666666', fontStyle: 'italic' }}>
                  Place of exam
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS TABLE TITLE */}
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#3A0F14', marginBottom: '10px' }}>
            Ergebnis - Results
          </div>

          {/* TABLE */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '9px' }}>
            <thead>
              <tr style={{ backgroundColor: '#E7E3DC', borderBottom: '1px solid #C9C4BC' }}>
                <th style={{ padding: '8px', textAlign: 'left', color: '#111111', fontWeight: 'bold', fontSize: '9px', borderRight: '1px solid #C9C4BC' }}></th>
                <th style={{ padding: '8px', textAlign: 'left', color: '#111111', fontWeight: 'bold', fontSize: '9px', borderRight: '1px solid #C9C4BC' }}>Erreichte Punktstand</th>
                <th style={{ padding: '8px', textAlign: 'left', color: '#111111', fontWeight: 'bold', fontSize: '9px' }}>maximale Punktzahl</th>
              </tr>
              <tr style={{ backgroundColor: '#E7E3DC', borderBottom: '1px solid #C9C4BC' }}>
                <th style={{ padding: '2px 8px', textAlign: 'left', color: '#111111', fontWeight: 'normal', fontSize: '8px', borderRight: '1px solid #C9C4BC' }}></th>
                <th style={{ padding: '2px 8px', textAlign: 'left', color: '#111111', fontWeight: 'normal', fontSize: '8px', borderRight: '1px solid #C9C4BC' }}>Attained score</th>
                <th style={{ padding: '2px 8px', textAlign: 'left', color: '#111111', fontWeight: 'normal', fontSize: '8px' }}>maximum score</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#F4F2EE', borderBottom: '1px solid #C9C4BC' }}>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', borderRight: '1px solid #C9C4BC' }}>Hören- Listening</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center', borderRight: '1px solid #C9C4BC' }}>{certificate.hoeren || 0}</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center' }}>100</td>
              </tr>
              <tr style={{ backgroundColor: 'white', borderBottom: '1px solid #C9C4BC' }}>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', borderRight: '1px solid #C9C4BC' }}>Lesen- Reading</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center', borderRight: '1px solid #C9C4BC' }}>{certificate.lesen || 0}</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center' }}>100</td>
              </tr>
              <tr style={{ backgroundColor: '#F4F2EE', borderBottom: '1px solid #C9C4BC' }}>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', borderRight: '1px solid #C9C4BC' }}>Schreiben- Writing</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center', borderRight: '1px solid #C9C4BC' }}>{certificate.schreiben || 0}</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center' }}>100</td>
              </tr>
              <tr style={{ backgroundColor: 'white' }}>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', borderRight: '1px solid #C9C4BC' }}>Sprechen- Speaking</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center', borderRight: '1px solid #C9C4BC' }}>{certificate.sprechen || 0}</td>
                <td style={{ padding: '6px 8px', color: '#111111', fontSize: '10px', textAlign: 'center' }}>100</td>
              </tr>
            </tbody>
          </table>

          {/* FOOTER SECTION */}
          <div style={{ marginTop: '40px', borderTop: '1px solid #C9C4BC', paddingTop: '15px', fontSize: '9px', color: '#111111' }}>
            <div>Kigali, {formatDateToGerman(certificate.pruefungsdatum)}</div>
            <div style={{ fontSize: '8px', color: '#666666', marginTop: '2px' }}>Ort Datum - Location, date</div>
            
            <div style={{ marginTop: '15px' }}>
              <div>Please verify the validity of the certificate here : www.kigalideutschacademy.com</div>
              <div style={{ marginTop: '3px' }}>Email : deutschconnectacademy@gmail.com Or scan the code</div>
            </div>

            {certificate.qr_code_url && (
              <div style={{ marginTop: '15px' }}>
                <img src={certificate.qr_code_url} alt="QR Code" style={{ width: '60px', height: '60px', display: 'block' }} />
              </div>
            )}
          </div>

          {/* BOTTOM BRANDING */}
          
        </div>

        {/* PAGE 2: RATING SCALE */}
        <div style={{ backgroundColor: 'white', padding: 'clamp(20px, 5vw, 60px)', marginTop: 'clamp(20px, 3vh, 40px)', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
          
          {/* HEADER WITH PALE BANNER AND LOGO */}
          <div style={{ backgroundColor: '#F4F3C2', padding: 'clamp(15px, 3vw, 20px)', borderRadius: '6px', marginBottom: 'clamp(20px, 4vh, 40px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(10px, 2vh, 15px)' }}>
            <div style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold' }}>
              <span style={{ color: '#111111' }}>KIGALI </span>
              <span style={{ color: '#3A0F14' }}>DEUTSCH</span>
              <span style={{ color: '#111111' }}> ACADEMY</span>
            </div>
            <img src="/kda-logo.svg" alt="KDA Logo" style={{ height: 'clamp(60px, 10vw, 90px)', width: 'auto' }} />
          </div>

          {/* RATING SCALE TITLE */}
          <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 'bold', color: '#3A0F14', marginBottom: 'clamp(12px, 2vh, 15px)', textAlign: 'center' }}>
            Bewertungsskala – Rating Scale
          </div>

          {/* RATING TABLE */}
          <table style={{ width: '100%', maxWidth: '600px', margin: '0 auto', borderCollapse: 'collapse', fontSize: 'clamp(9px, 2vw, 10px)' }}>
            <thead>
              <tr style={{ backgroundColor: '#E7E3DC', borderBottom: '1px solid #C9C4BC' }}>
                <th style={{ padding: 'clamp(8px, 1.5vw, 10px)', textAlign: 'left', color: '#111111', fontWeight: 'bold', borderRight: '1px solid #C9C4BC' }}>PUNKTE · POINTS</th>
                <th style={{ padding: 'clamp(8px, 1.5vw, 10px)', textAlign: 'left', color: '#111111', fontWeight: 'bold' }}>PRÄDIKAT · RATING</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#F4F2EE', borderBottom: '1px solid #C9C4BC' }}>
                <td style={{ padding: 'clamp(8px, 1.5vw, 10px)', color: '#111111', borderRight: '1px solid #C9C4BC', fontWeight: 'bold' }}>100 – 90</td>
                <td style={{ padding: 'clamp(8px, 1.5vw, 10px)', color: '#111111', fontWeight: 'bold' }}>SEHR GUT · VERY GOOD</td>
              </tr>
              <tr style={{ backgroundColor: 'white', borderBottom: '1px solid #C9C4BC' }}>
                <td style={{ padding: '10px', color: '#111111', borderRight: '1px solid #C9C4BC', fontWeight: 'bold' }}>89 – 80</td>
                <td style={{ padding: '10px', color: '#111111', fontWeight: 'bold' }}>GUT · GOOD</td>
              </tr>
              <tr style={{ backgroundColor: '#F4F2EE', borderBottom: '1px solid #C9C4BC' }}>
                <td style={{ padding: '10px', color: '#111111', borderRight: '1px solid #C9C4BC', fontWeight: 'bold' }}>79 – 70</td>
                <td style={{ padding: '10px', color: '#111111', fontWeight: 'bold' }}>BEFRIEDIGEND · SATISFACTORY</td>
              </tr>
              <tr style={{ backgroundColor: 'white', borderBottom: '1px solid #C9C4BC' }}>
                <td style={{ padding: '10px', color: '#111111', borderRight: '1px solid #C9C4BC', fontWeight: 'bold' }}>69 – 60</td>
                <td style={{ padding: '10px', color: '#111111', fontWeight: 'bold' }}>AUSREICHEND · PASS</td>
              </tr>
              <tr style={{ backgroundColor: '#F4F2EE' }}>
                <td style={{ padding: '10px', color: '#111111', borderRight: '1px solid #C9C4BC', fontWeight: 'bold' }}>59 – 0</td>
                <td style={{ padding: '10px', color: '#111111', fontWeight: 'bold' }}>NICHT BESTANDEN · FAIL</td>
              </tr>
            </tbody>
          </table>

          {/* BOTTOM BANNER */}
          <div style={{ backgroundColor: '#F4F3C2', padding: '15px', borderRadius: '6px', marginTop: '40px' }}>
          </div>
        </div>
      </div>
    </div>
  )
}
