describe('On initial page load', function () {
  before(() => {
    cy.visit('http://localhost:3000/');
  });

  ['#map',
    '#info', '#info #latitude', '#info #longitude',
    '#info #county', '#score',
    'button#start',  'button#quit', 'button#quit',
    'button#north', 'button#south', 'button#east', 'button#west',
    '#score'
  ].forEach((selector) => {
    it('Should have a ' + selector + ' element', function () {
      cy.get(selector); // this will fail if the given element is missing
    });
  });
});



describe('the Geovermonter app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });


  describe('After clicking start', () => {
    beforeEach(() => {
      cy.get('button#start').click();
    });

    it('the Start button should be disabled', () => {
      cy.get('button#start').should('be.disabled');
    });

    it('the Quit button should be enabled', () => {
      cy.get('button#quit').should('be.enabled');
    });

    it('the Guess button should be enabled', () => {
      cy.get('button#guess').should('be.enabled');
    });

    describe('the info fields', () => {
      ['#info #latitude', '#info #longitude',
        '#info #county'
      ].forEach((selector) => {
        it(selector + ' element should contain a question mark', function () {
          cy.get(selector).then((element) => {
            assert.equal('?', element.text());
          });
        });
      });
    });
  });

  describe('when user clicks "I Give Up"', () => {
    beforeEach(() => {
      cy.get('button#start').click();
      cy.get('#quit').click();
    });


    it('shows latitude & longitude', function () {
      cy.get('#info #latitude').contains(/(42|43|44)/);
      cy.get('#info #longitude').contains(/(-73|-72|-71)/);
    });


    describe('and then clicks start', () => {
      beforeEach(() => {
        cy.get('button#start').click();
      });

      ['#info #latitude',
        '#info #longitude',
        '#info #county'
      ].forEach((selector) => {

        it(selector + ' element should contain a question mark', function () {
          cy.get(selector).then((element) => {
            assert.equal(element.text(), '?');
          });
        });
      });

    });
  });

  describe('when user clicks "Guess"', () => {
    beforeEach(() => {
      cy.get('#start').click();
      cy.get('#guess').click();

    });
    it('asks "What county are we in?" and lists the counties', function () {
      cy.get('#guess-wrapper').contains('What county are we in?');
      cy.get('#guesslist').contains('Addison');
    });
    it('shows a dialog box with "Guess" and "Cancel" buttons', function () {
      cy.get('button#guessbutton').contains('Guess');
      cy.get('button#cancelbutton').contains('Cancel');
    });
    describe('when the user selects the correct county and clicks "Guess"', function () {
      it('fills in the info and informs the user "Correct!"', function () {
        cy.get('#cheat-sheet').then((guess) => {
          cy.get(`#${guess[0].innerHTML}`).click();
          cy.get('button#guessbutton').click();
          cy.get('#winners-circle').contains('Correct')
        })

      });
    });
  });
});
