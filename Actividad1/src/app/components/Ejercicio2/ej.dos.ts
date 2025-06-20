import { Component } from "@angular/core";
import { pelicula } from "src/app/estructuras/general";
import { Firestore, collection, collectionData, doc, query, setDoc, where, deleteDoc, orderBy } from "@angular/fire/firestore";

@Component({
    selector: 'ej-dos',
    templateUrl: './ej.dos.html',
    styleUrls: ['./ej.dos.css']
})
export class EjDosComponent {
    peliculaModal: pelicula = new pelicula();
    listaPeliculas: pelicula[] = [];
    coleccionPelicula = collection(this.firestore, 'Pelicula');
    filtradoEstatus: string = '';

    constructor(private firestore: Firestore) {
        this.limpiarFiltro();
    }

    registrarPelicula() {
        if (!this.validarCamposVacios()) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }
        if (!this.validarPersonas()) {
            return;
        }
        if (!this.validarDuracion()) {
            return;
        }

        this.peliculaModal.peliculaId = this.generarID(15);
        const ruta = doc(this.firestore, 'Pelicula', this.peliculaModal.peliculaId);
        setDoc(ruta, JSON.parse(JSON.stringify(this.peliculaModal))).then(() => {
            this.peliculaModal = new pelicula();
            document.getElementById("cerrarModal")?.click();
            alert('La película se ha registrado correctamente.');
        });
    }

    generarID(tamaño: number) {
        let letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        let id = '';
        let totalLetras = letras.length;
        for (let i = 0; i < tamaño; i++) {
            id += letras.charAt(Math.floor(Math.random() * totalLetras));
        }
        return id;
    }

    editarPelicula() {
        if (!this.validarCamposVacios()) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }
        if (!this.validarPersonas()) {
            return;
        }
        if (!this.validarDuracion()) {
            return;
        }
        const ruta = doc(this.firestore, 'Pelicula', this.peliculaModal.peliculaId);
        setDoc(ruta, JSON.parse(JSON.stringify(this.peliculaModal))).then(() => {
            this.peliculaModal = new pelicula();
            document.getElementById("cerrarModal")?.click();
            alert('La película se ha actualizado correctamente.');
        });
    }

    eliminarPelicula(getPelicula: pelicula) {
        if (confirm('¿Estás seguro de eliminar esta película? Esta acción no se puede revertir.')) {
            const ruta = doc(this.firestore, 'Pelicula', getPelicula.peliculaId);
            deleteDoc(ruta).then(() => {
                this.peliculaModal = new pelicula();
                document.getElementById("cerrarModal")?.click();
                alert('La película ha sido eliminada.');
            });
        }
    }

    abrirFormulario() {
        this.peliculaModal = new pelicula();
    }

    edicionPelicula(getPelicula: pelicula) {
        this.peliculaModal = getPelicula;
        this.peliculaModal.edicion = true;
    }

    filtrarPeliculas() {
        const filtro = query(
            this.coleccionPelicula,
            where('estatus', '==', this.filtradoEstatus),
            orderBy('titulo', 'asc')
        );
        collectionData(filtro).subscribe((listadoPelicula) => {
            this.listaPeliculas = [];
            listadoPelicula.forEach(peli => {
                let elemento = new pelicula();
                elemento.llenado(peli);
                this.listaPeliculas.push(elemento);
            });
        });
    }

    limpiarFiltro() {
        const consulta = query(this.coleccionPelicula, orderBy('titulo', 'asc'));
        collectionData(consulta).subscribe((listadoPelicula) => {
            this.listaPeliculas = [];
            listadoPelicula.forEach(peli => {
                let elemento = new pelicula();
                elemento.llenado(peli);
                this.listaPeliculas.push(elemento);
            });
        });
    }

    validarCamposVacios(): boolean {
        if (this.peliculaModal.titulo.trim() === '' ||
            this.peliculaModal.horario === null ||
            this.peliculaModal.personas === 0 ||
            this.peliculaModal.sala.trim() === '' ||
            this.peliculaModal.clasificacion.trim() === '' ||
            this.peliculaModal.duracion === 0
        )
            return false;
        return true;
    }

    validarPersonas(): boolean {
        if (this.peliculaModal.personas < 1 || this.peliculaModal.personas > 100) {
            alert('El número de personas debe estar entre 1 y 100.');
            return false;
        }
        return true;
    }

    validarDuracion(): boolean {
        if (this.peliculaModal.duracion < 1 || this.peliculaModal.duracion > 300) {
            alert('La duración debe estar entre 1 y 300 minutos.');
            return false;
        }
        return true;
    }
}
