function generateUsername(processNumber: string): string {
  return `P${processNumber}`
}

function generatePassword(): string {
  const digits = "0123456789"
  let password = ""

  for (let i = 0; i < 5; i++) {
    password += digits.charAt(Math.floor(Math.random() * digits.length))
  }

  return password
}

export { generateUsername, generatePassword }
