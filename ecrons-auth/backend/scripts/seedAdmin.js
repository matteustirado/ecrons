const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { authenticator } = require('otplib');
const qrcode = require('qrcode-terminal');
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const prisma = new PrismaClient();
const rl = readline.createInterface({ input, output });

async function bootstrap() {
  try {
    const existingAdmin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    
    if (existingAdmin) {
      console.error('\n[ BLOQUEIO DE SEGURANÇA ] Um usuário SUPER_ADMIN já existe. O cadastro externo está selado. Abortando.\n');
      process.exit(1);
    }

    console.log('\n=== Ecrons Auth: Bootstrap de Administrador ===\n');
    
    const username = await rl.question('Digite o Username do administrador: ');
    const password = await rl.question('Digite a Senha (ficará visível no console): ');

    if (!username || password.length < 8) {
      console.error('\n[ ERRO ] Dados inválidos ou senha curta demais (mínimo 8 caracteres).\n');
      process.exit(1);
    }

    console.log('\nProcessando criptografia e chaves...\n');

    const passwordHash = await bcrypt.hash(password, 12);
    const totpSecret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(username, 'Ecrons_SSO', totpSecret);

    await prisma.user.create({
      data: {
        username: username,
        password: passwordHash,
        totpSecret,
        isTotpEnabled: true,
        role: 'SUPER_ADMIN'
      }
    });

    console.log('\n[ SUCESSO ] Conta criada e trancada com sucesso.\n');
    console.log('Escaneie o QR Code abaixo no seu aplicativo (Google Authenticator, Authy, Apple Passwords):\n');

    qrcode.generate(otpauthUrl, { small: true });

    console.log('\n⚠️ Chave Manual (Backup):', totpSecret);
    console.log('O painel web aceitará apenas logins via 2FA a partir de agora.\n');

  } catch (error) {
    console.error('\n[ ERRO CRÍTICO ]', error);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

bootstrap();