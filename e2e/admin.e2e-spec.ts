import { browser, by, element, protractor } from 'protractor';

describe('AdminComponent E2E Test', () => {
  beforeEach(async () => {
    await browser.get('/admin');
  });

  it('should fetch booked tickets successfully', async () => {
    await element(by.css('input[name="movieName"]')).sendKeys('Sample Movie');
    await element(by.buttonText('View Booked Tickets')).click();

    const tickets = element.all(by.css('tbody tr'));
    await browser.wait(protractor.ExpectedConditions.presenceOf(tickets.first()), 5000);
    const count = await tickets.count();
    expect(count).greaterThan(0);
  });

  it('should alert when no movie name is provided for fetching tickets', async () => {
    await element(by.buttonText('View Booked Tickets')).click();

    const alertDialog = browser.switchTo().alert();
    const alertText = await alertDialog.getText();
    expect(alertText).equal('Please enter a movie name');
    await alertDialog.accept();
  });

  it('should delete movie and show success alert', async () => {
    await element(by.css('input[name="movieName"]')).sendKeys('Sample Movie');
    await element(by.buttonText('Delete Movie')).click();

    const alertDialog = browser.switchTo().alert();
    const alertText = await alertDialog.getText();
    expect(alertText).equal('Deleted Sucessfully');
    await alertDialog.accept();
  });

  it('should update ticket status and show success alert', async () => {
    await element(by.css('input[name="movieName"]')).sendKeys('Sample Movie');
    await element(by.buttonText('Update Ticket Status')).click();

    const alertDialog = browser.switchTo().alert();
    const alertText = await alertDialog.getText();
    expect(alertText).equal('Updated Sucessfully');
    await alertDialog.accept();
  });
});
