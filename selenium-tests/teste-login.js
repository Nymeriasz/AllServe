// selenium-tests/teste-login.js
import { Builder, By, until } from 'selenium-webdriver';

(async function testeLogin() {
  // 1. Inicia o navegador
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log("1. Iniciando teste de Login...");
    
    // 2. Acessa o site (O servidor DEVE estar rodando em outro terminal)
    await driver.get('http://localhost:5173/login');

    // 3. Aguarda o campo de email aparecer
    await driver.wait(until.elementLocated(By.name('email')), 5000);

    // 4. Preenche credenciais (USE DADOS REAIS DO SEU FIREBASE)
    // Se não tiver esse usuário, o teste vai falhar no login
    await driver.findElement(By.name('email')).sendKeys('teste@teste.com'); 
    await driver.findElement(By.name('password')).sendKeys('123456'); 
    console.log("2. Credenciais preenchidas.");

    // 5. Clica no botão (Procurando pelo texto do botão Chakra UI)
    // O XPath procura um botão que contenha o texto "Entrar"
    const loginButton = await driver.findElement(By.xpath("//button[contains(text(), 'Entrar')]"));
    await loginButton.click();
    console.log("3. Botão clicado.");

    // 6. Validação: Espera a URL mudar para incluir '/dashboard'
    await driver.wait(until.urlContains('/dashboard'), 10000);
    
    console.log("✅ SUCESSO: Redirecionado para o Dashboard!");

  } catch (error) {
    console.error("❌ FALHA NO TESTE:", error);
  } finally {
    // Fecha o navegador
    await driver.quit();
  }
})();