import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Modal from './ThreeModal'
import { OrbitControls, Stats } from '@react-three/drei'
import { FarmModalContainer } from './FarmModalContainer'

function ThreejsCanvas() {
  return (
    <FarmModalContainer>
      <Canvas camera={{ position: [0, 3, 4] }}>
        <ambientLight intensity={0.4} />
        <Suspense fallback={null}>
          <Modal url='/farmhouse.glb' />
        </Suspense>
        <OrbitControls />
        {/* <Stats /> */}
      </Canvas>
    </FarmModalContainer>
  )
}

export default ThreejsCanvas
