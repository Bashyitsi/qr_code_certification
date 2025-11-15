export interface AdminSession {
  isAuthenticated: boolean
  email?: string
}

export class AdminAuth {
  static authenticate(email: string, password: string): boolean {
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD
    
    return email === adminEmail && password === adminPassword
  }
  
  static createSession(): AdminSession {
    return {
      isAuthenticated: true,
      email: process.env.ADMIN_EMAIL
    }
  }
}
