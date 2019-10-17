describe('Home Screen', () => {

	it('has the correct title and subtitle', () => {
		cy.visit('/')
		cy.contains('h1', 'Bored or Confused')
		cy.contains('h2', 'A tool for getting questions and feedback from students while lecturing. Great for introverts.')
	});

	it('navigates to the student screen', () => {
	  cy.get('a#student-button').click()
		cy.url().should('include', '/student');
	});

	it('navigates to the instructor screen', () => {
	  cy.get('a#instructor-button').click()
		cy.url().should('include', '/instructor');
	});

	// it('navigates to /about', () => {
	// 	cy.get('nav a').contains('about').click();
	// 	cy.url().should('include', '/about');
	// });

	// it('navigates to /blog', () => {
	// 	cy.get('nav a').contains('blog').click();
	// 	cy.url().should('include', '/blog');
	// });
});

describe('Instructor Screen', () => {

	it('creates a new class', () => {
		cy.visit('/instructor')
		cy.get('a#create-class').click();
		cy.url().should('include', '/instructor/dashboard');
	});

	it('creates a first topic', () => {
		cy.wait(3000)
		addTopic(1, 'This is the first topic');
	});

	it('creates a second topic', () => {
		addTopic(2, 'This is the second topic');
	});

	it('creates a third topic', () => {
		addTopic(3, 'This is the third topic');
	});

	it('deletes the last topic', () => {
		deleteTopic(3, 'This is the second topic');
		cy.get(`#tab-item-2`).should('not.exist');
	});

	it('adds a bunch more topics', () => {
		addTopic(3, 'This is the new third topic');
		addTopic(4, 'This is the fourth topic');
		addTopic(5, 'This is the fifth topic');
		addTopic(6, 'This is the sixth topic');
	});

	it('deletes a middle topic', () => {
		cy.get('#tab-item-2').click();
		deleteTopic(3, 'This is the second topic');
	});

	function addTopic(position, title) {
		const index = position - 1;
		cy.get('button#add-topic').click();
		cy.get('input#topic').type(title)
		cy.get('button#submit-topic').click();
		cy.get(`a#tab-item-${index}`).contains(title)
	}

	function deleteTopic(position, previousTabTitle) {
		const index = position - 1;
		cy.get('button.delete').click();
		cy.get(`#tab-item-${index - 1}`).contains(previousTabTitle)
		cy.get('.card-content > .title').contains(previousTabTitle)
	}

});

// describe('Student Screen', () => {
// 	beforeEach(() => {
// 		cy.visit('/student')
// 	});

// 	it('accepts the Class ID', () => {
// 		cy.get('input.input').type('2dkc');
// 	});

// });