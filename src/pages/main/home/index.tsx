import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import styl from './index.styl'

const Home = () => {
  const threeObj: any = useRef({
    SEPARATION: 80,
    AMOUNTX: 50,
    AMOUNTY: 50,
    container123: null,
    camera: null,
    scene: null,
    renderer: null,
    mesh: null,
    stats: null,
    particles: null,
    count: 0,
    mouseX: 0,
    mouseY: 0,
    windowHalfX: window.innerWidth / 2,
    windowHalfY: window.innerHeight / 2
  })
  useEffect(() => {
    init()
    animate()
  }, [])

  function init() {
    threeObj.current.container123 = document.getElementById('container123')

    threeObj.current.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    threeObj.current.camera.position.z = 1200

    threeObj.current.scene = new THREE.Scene()
    // this.scene.background = new THREE.Color(0xa0a0a0)
    //

    const numParticles = threeObj.current.AMOUNTX * threeObj.current.AMOUNTY

    const positions = new Float32Array(numParticles * 3)
    const scales = new Float32Array(numParticles)

    let i = 0
    let j = 0

    for (let ix = 0; ix < threeObj.current.AMOUNTX; ix++) {
      for (let iy = 0; iy < threeObj.current.AMOUNTY; iy++) {
        positions[i] =
          ix * threeObj.current.SEPARATION -
          (threeObj.current.AMOUNTX * threeObj.current.SEPARATION) / 2 // x
        positions[i + 1] = 0 // y
        positions[i + 2] =
          iy * threeObj.current.SEPARATION -
          (threeObj.current.AMOUNTY * threeObj.current.SEPARATION) / 2 // z

        scales[j] = 1

        i += 3
        j++
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.addAttribute('scale', new THREE.BufferAttribute(scales, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color('rgba(33, 142, 242, 0.1)') }
      },
      vertexShader: `attribute float scale;

			void main() {

				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

				gl_PointSize = scale * ( 300.0 / - mvPosition.z );

				gl_Position = projectionMatrix * mvPosition;

			}`,
      fragmentShader: `uniform vec3 color;

			void main() {

				if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

				gl_FragColor = vec4( color, 1.0 );

			}`
    })

    //

    threeObj.current.particles = new THREE.Points(geometry, material)
    threeObj.current.scene.add(threeObj.current.particles)

    //

    threeObj.current.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    // const renderer = new THREE.WebGLRenderer( { alpha: true } );
    threeObj.current.renderer.setClearAlpha(0)
    // threeObj.current.renderer.setClearColorHex(0xffffff, 1)
    threeObj.current.renderer.setPixelRatio(window.devicePixelRatio)
    threeObj.current.renderer.setSize(window.innerWidth, window.innerHeight)
    threeObj.current.container123.appendChild(
      threeObj.current.renderer.domElement
    )

    window.addEventListener('resize', onWindowResize, false)
  }
  function onWindowResize() {
    threeObj.current.windowHalfX = window.innerWidth / 2
    threeObj.current.windowHalfY = window.innerHeight / 2

    threeObj.current.camera.aspect = window.innerWidth / window.innerHeight
    threeObj.current.camera.updateProjectionMatrix()

    threeObj.current.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function animate() {
    requestAnimationFrame(animate)

    render()
    // this.stats.update()
  }
  function render() {
    // this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05
    // this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05
    threeObj.current.camera.position.x = 36
    threeObj.current.camera.position.y = 310

    // console.log(threeObj.current.camera.position, 'threeObj.current.camera.position')
    threeObj.current.camera.lookAt(threeObj.current.scene.position)

    const positions =
      threeObj.current.particles.geometry.attributes.position.array
    const scales = threeObj.current.particles.geometry.attributes.scale.array

    let i = 0
    let j = 0

    for (let ix = 0; ix < threeObj.current.AMOUNTX; ix++) {
      for (let iy = 0; iy < threeObj.current.AMOUNTY; iy++) {
        positions[i + 1] =
          Math.sin((ix + threeObj.current.count) * 0.3) * 50 +
          Math.sin((iy + threeObj.current.count) * 0.5) * 50

        scales[j] =
          (Math.sin((ix + threeObj.current.count) * 0.3) + 1) * 4 +
          (Math.sin((iy + threeObj.current.count) * 0.5) + 1) * 4

        i += 3
        j++
      }
    }

    threeObj.current.particles.geometry.attributes.position.needsUpdate = true
    threeObj.current.particles.geometry.attributes.scale.needsUpdate = true

    threeObj.current.renderer.render(
      threeObj.current.scene,
      threeObj.current.camera
    )

    threeObj.current.count += 0.03
  }
  return (
    <div className={styl.homepage}>
      <div id="container123"></div>
    </div>
  )
}
export default Home
