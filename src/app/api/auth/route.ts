import { NextRequest, NextResponse } from 'next/server'
import { AdminAuth } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const isValid = AdminAuth.authenticate(email, password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const session = AdminAuth.createSession()
    
    const response = NextResponse.json(
      { message: 'Authentication successful', user: session },
      { status: 200 }
    )

    // Set HTTP-only cookie for session
    response.cookies.set('admin-session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' })
  
  response.cookies.delete('admin-session')
  
  return response
}
