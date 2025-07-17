describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('debería permitir login con credenciales válidas (admin)', () => {
    cy.get('ion-input[formcontrolname="usuario"] input').type('admin');
    cy.get('ion-input[formcontrolname="contrasena"] input').type('1234');
    cy.get('ion-button').contains('Ingresar').click();

    // Esperar que navegue al home
    cy.location('pathname', { timeout: 10000 }).should('include', '/home');
    cy.get('ion-title').contains('Bienvenido a Dr. Cocktail').should('exist');
  });

  it('debería mostrar error si el usuario está vacío', () => {
    cy.get('ion-input[formcontrolname="contrasena"] input').type('1234');
    cy.get('ion-button').contains('Ingresar').click();
    cy.get('ion-alert').should('exist');
  });

  it('debería mostrar error si la contraseña está vacía', () => {
    cy.get('ion-input[formcontrolname="usuario"] input').type('admin');
    cy.get('ion-button').contains('Ingresar').click();
    cy.get('ion-alert').should('exist');
  });

  it('debería mostrar error si las credenciales son incorrectas', () => {
    cy.get('ion-input[formcontrolname="usuario"] input').type('admin');
    cy.get('ion-input[formcontrolname="contrasena"] input').type('incorrecta');
    cy.get('ion-button').contains('Ingresar').click();
    cy.get('ion-alert').should('exist');
  });

  it('debería navegar al registro', () => {
    cy.get('ion-button').contains('Ya tengo una cuenta').click();
    cy.location('pathname', { timeout: 5000 }).should('include', '/registro');
    cy.get('ion-title').contains('Registro').should('exist');
  });

  it('debería mostrar el mensaje "Acerca de" al presionar el botón', () => {
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alerta');
    });
    cy.get('ion-button').contains('Acerca de').click();
    cy.get('@alerta').should('have.been.calledWithMatch', 'Alumno: Ludwig Lindermann');
  });
});
