import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Modal from './ThreeModal'
import { OrbitControls, Stats, PerspectiveCamera } from '@react-three/drei'
import { FarmModalContainer } from './FarmModalContainer'

function ThreejsCanvas() {
  return (
    <FarmModalContainer>
      <Canvas camera={{ fov: 65, position: [0, 0, 5] }}>
        <PerspectiveCamera />
        <ambientLight intensity={0.2} />
        <Suspense fallback={null}>
          <Modal url='/farmhouse2.0.glb' />
        </Suspense>
        <OrbitControls />
        {/* <Stats /> */}
      </Canvas>
    </FarmModalContainer>
  )
}

export default ThreejsCanvas
