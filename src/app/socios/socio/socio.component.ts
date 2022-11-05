import { Component, OnInit } from '@angular/core';
import { FormGroup, FormRecord } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Socio } from 'src/app/Usuario/socio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import {MatListModule } from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@Component({
  standalone:true,
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css'],
  imports: [ FormGroup, MatToolbarModule,MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatListModule ]
})

export class socioComponent implements OnInit
{
    socio : FormGroup;
    socios : Socio[] = [];
	  socioModificado : Socio | null = null;
  	duracionSnackbar : number = 5000;
    schemas= [ CUSTOM_ELEMENTS_SCHEMA];


    constructor(private snackBar : MatSnackBar)
    {
		// Creación del socio con FormControls y Validators
        this.socio = new FormGroup({
            nombre : new FormControl("", [Validators.required, Validators.minLength(3)]),
            apellidos : new FormControl("", [Validators.required, Validators.minLength(3)]),
            numeroDeSocio : new FormControl("", Validators.required),
            dni : new FormControl("", [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
            telefono : new FormControl("", Validators.required),
            sexo : new FormControl("", Validators.required)
            });
  }

    ngOnInit(): void
    {
    }

    enviar() : void
    {
		// Si el socio no es válido o se está modificando un socio, salimos de la función
		if (!this.socio.valid || this.socioModificado != null)
		{
			this.snackBar.open("Error. Uno o más campos del socio no se han rellenado correctamente", "Aceptar", { duration : this.duracionSnackbar });
			return;
		}

		//Antes de crear nuevos socios comprobamos que el número de socio sea único
		if (!this.comprobarSocioUnico(this.socio.value.numeroDeSocio))
		{
			this.snackBar.open("Error. El número de cliente introducido ya existe", "Aceptar", { duration : this.duracionSnackbar });
			return;
		}

    	// Creamos una nueva persona y rellenamos su información
        let socio = new Socio();

        socio.nombre = this.socio.value.nombre;
        socio.apellidos = this.socio.value.apellidos;
        socio.numeroDeSocio = this.socio.value.numeroDeSocio;
        socio.dni = this.socio.value.dni;
        socio.telefono = this.socio.value.telefono;
        socio.sexo = this.socio.value.sexo;

        // Añadimos la persona al array y limpiamos el socio
        this.socios.push(socio);
        this.socio.reset();

		this.snackBar.open("socio enviado", "Aceptar", { duration : this.duracionSnackbar });
    }

    // Función para comprobar que todos los números de socio sean únicos y no haya ninguno repetido
    comprobarSocioUnico(numeroDeSocio : number) : boolean
    {
      let result : boolean = true;

      for (let s of this.socios)
      {
        if (numeroDeSocio == s.numeroDeSocio)
        {
          result = false;
          break;
        }
      }
      return result;
    }

	//Función eliminar socio de la lista de socios
	eliminar(event : MouseEvent, socio : Socio) : void
	{
		for (let i = this.socios.length - 1; i >= 0; -- i)
		{
			if (this.socios[i] == socio)
			{
				this.socios.splice(i, 1);
				break;
			}
		}
		// Si se estaba modificando el socio que queremos eliminar, limpiamos el
		// socioy asignamos el valor null a socioModificado
		if (this.socioModificado != null && this.socioModificado == socio)
		{
			this.socio.reset();
			this.socioModificado = null;
		}

		this.snackBar.open("El socio " + socio.nombre + " " + socio.apellidos + " ha sido eliminado", "Aceptar", { duration : this.duracionSnackbar });
	}

	//modificar socio de la lista de socios
	modificar(event : MouseEvent, socio : Socio) : void
	{
		// Para modificar un socio, nos guardamos una copia del mismo en socioModificado
		// y volcamos sus datos en el socio. En el archivo HTML comprobaremos
		// si cada uno de los socios a mostrar en la lista corresponde con
		// socioModificado. Si es el caso, mostraremos directamente los valores que
		// se están escribiendo en tiempo real en el socio
		this.socio.controls["nombre"].setValue(socio.nombre);
		this.socio.controls["apellidos"].setValue(socio.apellidos);
		this.socio.controls["numeroDeSocio"].setValue(socio.numeroDeSocio);
		this.socio.controls["dni"].setValue(socio.dni);
		this.socio.controls["telefono"].setValue(socio.telefono);
		this.socio.controls["sexo"].setValue(socio.sexo);

		this.socioModificado = socio;
	}

	// terminar de modificar a un socio, lo buscamos
	// en el array de socios y aplicamos los nuevos datos
	// que estén introducidos en el socio. Después, limpiamos
	// el socio y asignamos el valor null a socioModificado
	terminarModificacion(event : MouseEvent, socio : Socio) : void
	{
		for (let s of this.socios)
		{
			if (s == socio)
			{
				s.nombre = this.socio.value.nombre;
				s.apellidos = this.socio.value.apellidos;
				s.numeroDeSocio = this.socio.value.numeroDeSocio;
				s.dni = this.socio.value.dni;
				s.telefono = this.socio.value.telefono;
				s.sexo = this.socio.value.sexo;

				this.socio.reset();
				this.socioModificado = null;

				this.snackBar.open("El socio " + socio.nombre + " " + socio.apellidos + " ha sido modificado", "Aceptar", { duration : this.duracionSnackbar });

				break;
			}
		}
	}
}
