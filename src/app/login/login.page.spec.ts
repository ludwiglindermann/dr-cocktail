import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { FormsModule } from '@angular/forms';
/// <reference types="jasmine" />

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: Storage, useValue: storageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar alerta si usuario o contraseña están vacíos', async () => {
    component.usuario = '';
    component.contrasena = '';

    const alertaMock = { present: jasmine.createSpy() };
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertaMock as any));

    await component.ingresar();

    expect(alertControllerSpy.create).toHaveBeenCalled();
    expect(alertaMock.present).toHaveBeenCalled();
  });

  it('debe iniciar sesión como admin si las credenciales son admin/1234', async () => {
    component.usuario = 'admin';
    component.contrasena = '1234';

    await component.ingresar();

    expect(storageSpy.set).toHaveBeenCalledWith('usuarioActual', {
      usuario: 'admin',
      correo: 'admin@correo.cl'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debe mostrar alerta si credenciales no coinciden con usuarios guardados', async () => {
    component.usuario = 'otro';
    component.contrasena = 'clave';

    storageSpy.get.and.returnValue(Promise.resolve([]));
    const alertaMock = { present: jasmine.createSpy() };
    alertControllerSpy.create.and.returnValue(Promise.resolve(alertaMock as any));

    await component.ingresar();

    expect(alertControllerSpy.create).toHaveBeenCalled();
    expect(alertaMock.present).toHaveBeenCalled();
  });
});


/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/