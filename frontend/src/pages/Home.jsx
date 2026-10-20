import {useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'

const instagramSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.056 1.97.24 2.427.403a4.918 4.918 0 011.775 1.034 4.918 4.918 0 011.034 1.775c.163.457.347 1.257.403 2.427.058 1.266.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.403 2.427a4.918 4.918 0 01-1.034 1.775 4.918 4.918 0 01-1.775 1.034c-.457.163-1.257.347-2.427.403-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.427-.403a4.918 4.918 0 01-1.775-1.034 4.918 4.918 0 01-1.034-1.775c-.163-.457-.347-1.257-.403-2.427C2.175 15.747 2.163 15.368 2.163 12s.012-3.584.07-4.85c.056-1.17.24-1.97.403-2.427a4.918 4.918 0 011.034-1.775 4.918 4.918 0 011.775-1.034c.457-.163 1.257-.347 2.427-.403C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.775.128 4.827.308 4.005.57a6.92 6.92 0 00-2.52 1.64A6.92 6.92 0 00.57 4.73c-.262.822-.442 1.77-.5 3.048C.012 8.332 0 8.741 0 12c0 3.259.012 3.668.07 4.948.058 1.278.238 2.226.5 3.048a6.92 6.92 0 001.64 2.52 6.92 6.92 0 002.52 1.64c.822.262 1.77.442 3.048.5 1.28.058 1.689.07 4.948.07s3.668-.012 4.948-.07c1.278-.058 2.226-.238 3.048-.5a6.92 6.92 0 002.52-1.64 6.92 6.92 0 001.64-2.52c.262-.822.442-1.77.5-3.048.058-1.28.07-1.689.07-4.948s-.012-3.668-.07-4.948c-.058-1.278-.238-2.226-.5-3.048a6.92 6.92 0 00-1.64-2.52 6.92 6.92 0 00-2.52-1.64c-.822-.262-1.77-.442-3.048-.5C15.668.012 15.259 0 12 0z"/>
    <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z"/>
    <circle cx="18.406" cy="5.594" r="1.44"/>
  </svg>
)

const facebookSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.325v21.351C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.657-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.716-1.796 1.765v2.315h3.59l-.467 3.622h-3.123V24h6.116c.73 0 1.325-.594 1.325-1.324V1.325C24 .595 23.405 0 22.675 0z"/>
  </svg>
)

const twitterSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 00-8.38 4.482C7.69 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.708.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.918 4.918 0 003.946 4.827 4.996 4.996 0 01-2.224.084 4.922 4.922 0 004.6 3.417A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.058 0 14.01-7.514 14.01-14.01 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z"/>
  </svg>
)

function Home() {
  // Testimonios base originales
  const testimoniosBase = [
    { id: 1, autor: 'Laura P.', texto: 'Gracias a GYM FLOW logré mis objetivos en tiempo récord.' },
    { id: 2, autor: 'Martín R.', texto: 'El ambiente es increíble, me siento motivado en cada clase.' }
  ]

  const [listaTestimonios, setListaTestimonios] = useState(testimoniosBase)
  const [mostrarTodosTestimonios, setMostrarTodosTestimonios] = useState(false)

  // Carga los testimonios guardados por los usuarios
  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('testimonios_gymflow') || '[]')
    if (guardados.length > 0) {
      setListaTestimonios([...testimoniosBase, ...guardados])
    }
  }, [])

  // Muestra 3 por defecto; si toca "ver más", muestra todos
  const testimoniosVisibles = mostrarTodosTestimonios ? listaTestimonios : listaTestimonios.slice(0, 3)
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const imagenesGaleria = Array.from({ length: 40 }, (_, i) => '/img/galeria/galeria' + (i + 1) + '.jpg')
  const imagenesVisibles = mostrarTodas ? imagenesGaleria : imagenesGaleria.slice(0, 8)
  const usuarioLogueado =localStorage.getItem('usuario') || localStorage.getItem('token')
  const handleContactSubmit = (e) => {
    e.preventDefault()
    const nombre = e.target.nombre.value.trim()
    const email = e.target.email.value.trim()
    const mensaje = e.target.mensaje.value.trim()
    window.location.href = `mailto:ari27orlandi@gmail.com?subject=Contacto de ${nombre}&body=${encodeURIComponent(mensaje + '\n\nDesde: ' + email)}`
  }

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero" id="inicio">
        <h1>Bienvenidos a GYM FLOW</h1>
        <p>Transforma tu cuerpo y tu mente con nosotros</p>
        <a href="https://wa.me/5492645647790" target="_blank" rel="noreferrer" className="btn-hero">
          Contáctanos
        </a>
      </section>

      {/* SERVICIOS */}
      <section id="servicios">
        <h2>Nuestros Servicios</h2>
        <div className="servicios-container">
          <div className="servicio">
            <img src="/img/mujerconsoga.jpg" alt="Entrenamiento personalizado" />
            <h3>Entrenamiento Personalizado</h3>
            <p>Programas adaptados a tus necesidades y objetivos.</p>
          </div>
          <div className="servicio">
            <img src="/img/mujereselongando.jpg" alt="Clases grupales" />
            <h3>Clases Grupales</h3>
            <p>Motivación y diversión en cada sesión.</p>
          </div>
          <div className="servicio">
            <img src="/img/asesoramientonutri.jpg" alt="Nutrición" />
            <h3>Asesoramiento Nutricional</h3>
            <p>Planificación de dieta para mejorar tu rendimiento.</p>
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="galeria">
        <h2>Galería</h2>
        <div className="galeria-container">
          <img src="/img/hombrecondisco.jpg" alt="Imagen 1" />
          <img src="/img/profeayudandoahombres.jpg" alt="Imagen 2" />
          <img src="/img/mancuernarosa.jpg" alt="Imagen 3" />
          {imagenesVisibles.map((src, index) => (
            <img key={index} 
            src={src} 
            alt={'Galería ' + (index + 1)} 
            loading="lazy" 
            />
          ))}
        </div>
       <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            type="button"
            onClick={() => setMostrarTodas(!mostrarTodas)}
            style={{
              padding: '12px 30px',
              backgroundColor: '#00b4d8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '25px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 180, 216, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {mostrarTodas ? 'Ver menos fotos ↑' : 'Ver todas las fotos (40) ↓'}
          </button>
        </div>
      </section>
{/* TESTIMONIOS */}
      <section id="testimonios">
        <h2>Testimonios</h2>
        <div className="testimonios-container">
          {testimoniosVisibles.map((item) => (
            <div className="testimonio" key={item.id}>
              <p>"{item.texto}"</p>
              <span>- {item.autor}</span>
            </div>
          ))}
        </div>

        {/* Botón que aparece SOLO si hay más de 3 testimonios */}
        {listaTestimonios.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => setMostrarTodosTestimonios(!mostrarTodosTestimonios)}
              style={{
                padding: '10px 24px',
                backgroundColor: '#00b4d8',
                color: '#ffffff',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              {mostrarTodosTestimonios ? 'Ver menos testimonios ↑' : 'Ver más testimonios ↓'}
            </button>
          </div>
        )}
      </section>
       
       {/* CONTACTO */}
      <section id="contacto">
        <h2>Contacto</h2>
        <div className="contact-container">
          <form onSubmit={handleContactSubmit} className="contact-form">
            <input type="text" name="nombre" placeholder="Tu nombre" required />
            <input type="email" name="email" placeholder="Tu email" required />
            <textarea name="mensaje" placeholder="Escribe tu mensaje" required></textarea>
            <button type="submit">Enviar</button>
          </form>

          <div className="redes-sociales">
            <h3>Síguenos</h3>
            <ul>
              <li>
                <a href="#" target="_blank" rel="noreferrer">
                  {instagramSVG} Instagram
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noreferrer">
                  {facebookSVG} Facebook
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noreferrer">
                  {twitterSVG} Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="footer-home">
        <p>© 2025 GYM FLOW. Todos los derechos reservados.</p>
      </footer>
    </>
  )
}

export default Home
