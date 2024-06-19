import { browser, by, element, protractor } from 'protractor';

describe('RegisterComponent E2E Test', () => {
  beforeEach(() => {
    browser.get('/register');
  });

  it('should register a new user successfully', () => {
    element(by.name('loginId')).sendKeys('testuser');
    element(by.name('firstName')).sendKeys('Test');
    element(by.name('lastName')).sendKeys('User');
    element(by.name('email')).sendKeys('testuser@example.com');
    element(by.name('contactNumber')).sendKeys('1234567890');
    element(by.name('password')).sendKeys('password123');
    element(by.name('confirmPassword')).sendKeys('password123');
    element(by.buttonText('Register')).click();

    const successMessage = element(by.css('.success-message'));
    browser.wait(protractor.ExpectedConditions.presenceOf(successMessage), 5000);
    expect(successMessage.isPresent());
  });

  it('should display an error when passwords do not match', () => {
    element(by.name('loginId')).sendKeys('testuser');
    element(by.name('firstName')).sendKeys('Test');
    element(by.name('lastName')).sendKeys('User');
    element(by.name('email')).sendKeys('testuser@example.com');
    element(by.name('contactNumber')).sendKeys('1234567890');
    element(by.name('password')).sendKeys('password123');
    element(by.name('confirmPassword')).sendKeys('differentpassword');
    element(by.buttonText('Register')).click();

    const errorMessage = element(by.css('.error-message'));
    browser.wait(protractor.ExpectedConditions.presenceOf(errorMessage), 5000);
    expect(errorMessage.isPresent());
  });
});
