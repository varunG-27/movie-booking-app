import { browser, by, element, protractor } from 'protractor';

describe('HomeComponent E2E Test', () => {
  beforeEach(async () => {
    await browser.get('/home');
  });

  it('should load all movies on initialization', async () => {
    const movies = element.all(by.css('.movie-item'));
    await browser.wait(protractor.ExpectedConditions.presenceOf(movies.first()), 5000);
    const count = await movies.count();
    expect(count).greaterThan(0);
  });

  it('should filter movies based on search query', async () => {
    const searchInput = element(by.css('input[name="search"]'));
    await searchInput.sendKeys('Sample Movie');

    const filteredMovies = element.all(by.css('.movie-item'));
    await browser.wait(protractor.ExpectedConditions.presenceOf(filteredMovies.first()), 5000);
    const count = await filteredMovies.count();
    expect(count).greaterThan(0);

    const firstMovieName = await filteredMovies.first().element(by.css('.movie-name')).getText();
    expect(firstMovieName.toLowerCase()).contain('sample movie');
  });

  it('should navigate to booking page when book button is clicked', async () => {
    const firstMovieBookButton = element.all(by.css('.book-button')).first();
    await firstMovieBookButton.click();

    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).contain('/booking');
  });

  it('should log out and navigate to login page', async () => {
    const logoutButton = element(by.buttonText('Logout'));
    await logoutButton.click();

    const currentUrl = await browser.getCurrentUrl();
    expect(currentUrl).contain('/login');
  });
});
