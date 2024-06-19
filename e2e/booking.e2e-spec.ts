import { browser, by, element, protractor } from 'protractor';

describe('BookingComponent E2E Test', () => {
  beforeEach(async () => {
    await browser.get('/booking/SampleMovie');
  });

  it('should initialize the booking form with movie name and login ID', async () => {
    const movieNameInput = element(by.css('input[name="movieName"]'));
    const loginIdInput = element(by.css('input[name="loginId"]'));

    expect(await movieNameInput.getAttribute('value')).equal('SampleMovie');
    expect(await loginIdInput.getAttribute('value')).not.equal('');
  });

  it('should book a ticket successfully and navigate to home page', async () => {
    const seatNumbersInput = element(by.css('input[name="seatNumbers"]'));
    const noOfTicketsInput = element(by.css('input[name="noOfTickets"]'));
    const submitButton = element(by.buttonText('Submit'));

    await seatNumbersInput.sendKeys('A1,A2,A3');
    await noOfTicketsInput.sendKeys('3');
    await submitButton.click();

    const alertDialog = browser.switchTo().alert();
    expect(await alertDialog.getText()).equal('Ticket Booked Successfully');
    await alertDialog.accept();

    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).contain('/home');
  });

  it('should show error when booking fails', async () => {
    
    const submitButton = element(by.buttonText('Submit'));

    await submitButton.click();

    const consoleLog = browser.manage().logs().get('browser');
    expect(consoleLog).contain(jasmine.objectContaining({ message: jasmine.stringMatching('booking failed') }));
  });

  it('should log out and navigate to login page', async () => {
    const logoutButton = element(by.buttonText('Logout'));
    await logoutButton.click();

    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).contain('/login');
  });
});
