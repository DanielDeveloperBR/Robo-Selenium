const { Builder, By, until } = require('selenium-webdriver');

async function op(driver, perguntaCerta) {
  try {
    let opcoes = await driver.wait(until.elementsLocated(By.css('.option')), 20000);
    for (let i = 0; i < opcoes.length; i++) {
      let op = await opcoes[i].getText();
      if (op == perguntaCerta) {
        await opcoes[i].click();
        await driver.sleep(2000);
        await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/footer/button')), 10000).click()
        break;
      }
    }
  } catch (error) {
    console.error('Erro ao interagir com o elemento:', error);
  }
}

async function obterResposta(driver, perguntaGeral) {
  let opcoes = await driver.wait(until.elementsLocated(By.css('.option')), 10000);
  let resposta = "";

  switch (true) {
    case /5 \+ 5/.test(perguntaGeral):
      resposta = "10";
      break;
    case /Qual o usuário\?/.test(perguntaGeral):
      resposta = "Login123";
      break;
    case /Qual a senha\?/.test(perguntaGeral):
      resposta = "Consegui";
      break;
    case /Qual elemento contém o texto Selenium\?/.test(perguntaGeral):
      resposta = "Esse robô utiliza Selenium";
      break;
    case /Selecione a etapa que contenha 19\?/.test(perguntaGeral):
      resposta = "Vote 19";
      break;
    default:
      console.error("Pergunta não reconhecida:", perguntaGeral);
      return;
  }

  for (let i = 0; i < opcoes.length; i++) {
    let opcaoTexto = await opcoes[i].getText();
    if (opcaoTexto === resposta) {
      await opcoes[i].click();
      await driver.sleep(2000)
      await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/footer/button')), 10000).click()
      break;
    }
  }
}

(async function robo() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('https://eduardofmarinho.github.io/Teste-Robo-Selenium-NodeJS/');

    await driver.wait(until.elementLocated(By.xpath('/html/body/div[1]/button')), 10000).click();
    await driver.sleep(1000)
    await driver.wait(until.elementLocated(By.xpath('/html/body/div[2]/div[3]/button[2]')), 10000).click();
    await driver.sleep(1000)

    // Primeira pergunta
    let pergunta = await driver.wait(until.elementLocated(By.css('.que_text')), 10000).getText();
    let operacao = pergunta.replace("1. ", "").replace(" = ?", "");
    let resposta = eval(operacao);
    await op(driver, resposta);

    // Segunda pergunta
    let pergunta2 = await driver.wait(until.elementLocated(By.css('.que_text')), 10000).getText();
    let res2 = pergunta2.replace('2. Qual questão contém o texto "', "").replace('"?', "");
    await op(driver, res2);

    // Terceira pergunta
    let pergunta3 = await driver.wait(until.elementLocated(By.css('.que_text')), 10000).getText();
    await obterResposta(driver, pergunta3);

    // Quarta pergunta
    let pergunta4 = await driver.wait(until.elementLocated(By.css('.que_text')), 10000).getText();
    await obterResposta(driver, pergunta4);

    // Quinta pergunta
    let pergunta5 = await driver.wait(until.elementLocated(By.css('.que_text')), 20).getText();
    await obterResposta(driver, pergunta5);

    // Sexta pergunta
    let pergunta6 = await driver.wait(until.elementLocated(By.css('.que_text')), 10000).getText();
    await obterResposta(driver, pergunta6);
    await driver.sleep(3000)
  }
  finally {
    await driver.quit();
  }
})();
