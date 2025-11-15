'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, QrCode } from 'lucide-react'
import Link from 'next/link'

const certificateSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required'),
  recipient_email: z.string().email('Invalid email address'),
  deutschlevel: z.string().optional(),
  geburtstag: z.string().optional(),
  geburtsort: z.string().optional(),
  pruefungsdatum: z.string().optional(),
  pruefungsort: z.string().optional(),
  hoeren: z.string().optional(),
  lesen: z.string().optional(),
  schreiben: z.string().optional(),
  sprechen: z.string().optional(),
})

type CertificateFormData = z.infer<typeof certificateSchema>

export default function CreateCertificatePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
  })

  const onSubmit = async (data: CertificateFormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      // Convert dates from DD.MM.YYYY to YYYY-MM-DD for PostgreSQL
      const convertGermanDate = (dateStr: string | undefined): string | undefined => {
        if (!dateStr || !dateStr.includes('.')) return dateStr
        const [day, month, year] = dateStr.split('.')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }

      // Convert numeric strings to numbers and dates to PostgreSQL format
      const submitData = {
        ...data,
        geburtstag: convertGermanDate(data.geburtstag),
        pruefungsdatum: convertGermanDate(data.pruefungsdatum),
        hoeren: data.hoeren ? parseInt(data.hoeren, 10) : undefined,
        lesen: data.lesen ? parseInt(data.lesen, 10) : undefined,
        schreiben: data.schreiben ? parseInt(data.schreiben, 10) : undefined,
        sprechen: data.sprechen ? parseInt(data.sprechen, 10) : undefined,
      }

      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.status === 401) {
        router.push('/admin/login')
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create certificate')
      }

      const certificate = await response.json()
      router.push(`/admin/dashboard?created=${certificate.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Create New Certificate</h1>
                <p className="mt-1 text-sm text-gray-600">German Language Exam Certificate (KIGALI DEUTSCH ACADEMY)</p>
              </div>
            </div>
            <QrCode className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Student Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                  Student Information (Studenteninformation)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-900">
                      Vorname und Name (First & Surname) *
                    </label>
                    <input
                      {...register('recipient_name')}
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                      placeholder="e.g., NIYOMUGABO Adelite"
                    />
                    {errors.recipient_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.recipient_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="recipient_email" className="block text-sm font-medium text-gray-900">
                      Email Address
                    </label>
                    <input
                      {...register('recipient_email')}
                      type="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                      placeholder="student@email.com"
                    />
                    {errors.recipient_email && (
                      <p className="mt-1 text-sm text-red-600">{errors.recipient_email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="geburtstag" className="block text-sm font-medium text-gray-900">
                      Geburtsdatum (Date of Birth)
                    </label>
                    <input
                      {...register('geburtstag')}
                      type="text"
                      placeholder="DD.MM.YYYY (e.g., 07.03.1996)"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="geburtsort" className="block text-sm font-medium text-gray-900">
                      Geburtsort (Place of Birth)
                    </label>
                    <input
                      {...register('geburtsort')}
                      type="text"
                      placeholder="e.g., KIGALI"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Exam Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                  Exam Information (Prüfungsinformation)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pruefungsdatum" className="block text-sm font-medium text-gray-900">
                      Prüfungsdatum (Exam Date)
                    </label>
                    <input
                      {...register('pruefungsdatum')}
                      type="text"
                      placeholder="DD.MM.YYYY (e.g., 26.10.2025)"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="pruefungsort" className="block text-sm font-medium text-gray-900">
                      Prüfungsort (Exam Location)
                    </label>
                    <input
                      {...register('pruefungsort')}
                      type="text"
                      placeholder="e.g., MUSANZE"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="deutschlevel" className="block text-sm font-medium text-gray-900">
                      DEUTSCH Level *
                    </label>
                    <select
                      {...register('deutschlevel')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    >
                      <option value="">Select Level</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                  Test Results (Erreichte Punktstand)
                </h3>
                <p className="text-sm text-gray-600 mb-4">Enter scores for each skill area (out of 100)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="hoeren" className="block text-sm font-medium text-gray-900">
                      Hören (Listening Score)
                    </label>
                    <input
                      {...register('hoeren')}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 80"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="lesen" className="block text-sm font-medium text-gray-900">
                      Lesen (Reading Score)
                    </label>
                    <input
                      {...register('lesen')}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 63"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="schreiben" className="block text-sm font-medium text-gray-900">
                      Schreiben (Writing Score)
                    </label>
                    <input
                      {...register('schreiben')}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 70"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="sprechen" className="block text-sm font-medium text-gray-900">
                      Sprechen (Speaking Score)
                    </label>
                    <input
                      {...register('sprechen')}
                      type="number"
                      min="0"
                      max="100"
                      placeholder="e.g., 60"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 bg-white px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/dashboard"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
