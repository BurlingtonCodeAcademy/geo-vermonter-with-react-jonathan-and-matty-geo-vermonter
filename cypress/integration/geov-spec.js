describe('On initial page load', function () {
  before(() => {
    cy.visit('http://localhost:3000/');
  });

  ['#map',
    '#info', '#info #latitude', '#info #longitude',
    '#info #county', '#score',
    'button#start', 'button#quit', 'button#quit',
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
      cy.get('button#start.hidden');
    });

    it('the Quit button should be enabled', () => {
      cy.get('button#quit.button').should('be.enabled');
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

  describe('when user clicks "Start"', () => {
    beforeEach(() => {
      cy.get('#start').click();

    });
    it('lists the counties', function () {
      cy.get('button#Addison-County.button').contains('Addison');
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

    describe('when the user clicks on the correct county', function () {
      it('fills in the info and informs the user "You won the game!"', function () {
        cy.get('#cheat-sheet').then((guess) => {
          cy.get(`#${guess[0].innerHTML}`).click();
          cy.get('#info #latitude').contains(/(42|43|44)/);
          cy.get('#info #longitude').contains(/(-73|-72|-71)/);
          cy.get('#info #county').contains(guess[0].innerHTML.split('-')[0]);
          cy.get('.winning').contains('You won the game!')
        });
      });
    });
  });
});
