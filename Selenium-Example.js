// Author: GNXB (Apiwith Potisuk)
// Created: 2017

// Instruction to install selenium-webdriver
// Read: https://www.npmjs.com/package/selenium-webdriver

const { Builder, By, until } = require('selenium-webdriver');
var app;

const URL = 'http://10.0.0.1',
  LOGIN_USER = 'admin',
  LOGIN_PASS = 'password',
  PATTERN = 'user_';

var start = 1,
  end = 10;

// function delay()
const delay = ms => new Promise(r => setTimeout(r, ms));

new Builder()
    .forBrowser('chrome')
    .build()
    .then(driver => {
        app = driver.get(URL);

        // Delay for waiting browser load a page
        // I'm not sure the event-handling about checking "is page loaded?" exist
        // I will back to see about this later
        delay(8000).then(() => {
          app.then(_ => driver.findElement(By.id('txt-user')).sendKeys(LOGIN_USER))
            .then(_ => driver.findElement(By.id('txt-pass')).sendKeys(LOGIN_PASS))
            .then(_ => driver.findElement(By.id('submit-btn')).click());

          // After this step the form will redirect to landing-page
          // URL may look like "http://10.0.0.1/home"
          // If the form redirect by itself, no any "driver.get(URL + '/home')" require
          // Follow normal behavior when using selenium

          // Delay for redirect after logged in
          delay(2000).then(() => {
            // Execute JavaScript Command
            driver.executeScript("loadTable();");

            delay(1000).then(() => {
              // Declare loop() and immediately execute
              (function loop() {
                var account = PATTERN + start;

                // Click on modal-window to add an account
                app.then(_ => driver.findElement(By.id('addUserBtn')).click());

                delay(2000).then(() => {
                  app.then(_ => driver.findElement(By.id('txt-account')).sendKeys(account))
                    .then(_ => driver.findElement(By.id('txt-pass')).sendKeys(account))
                    .then(_ => driver.findElement(By.id('txt-cpass')).sendKeys(account))
                    .then(_ => {
                      // How to set value to <select> Example #1
                      var select = driver.findElement(By.id('txt-org'));
                      select.click();
                      select.findElement(By.css("option[value='2']")).click()
                    })

                    // How to set value to <select> Example #2
                    .then(_ => driver.executeScript(`$("#txt-role option[value='2']").prop("selected", "selected");`))

                    // Save
                    .then(_ => driver.findElement(By.id('AddRecordDialogSaveButton')).click());

                  // Waiting for response from server after saving
                  delay(4000).then(() => {
                    if (start < end) {
                      start++;
                      loop();
                    } else {
                      app.then(_ => driver.quit());
                    }
                  });
                });
              })();
            });
          });
        });

      return app;
    });
