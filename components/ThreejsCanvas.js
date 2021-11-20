import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Modal from './ThreeModal'
import { OrbitControls, Stats } from '@react-three/drei'
import { CanvasContainer } from './CanvasContainer'

function ThreejsCanvas() {
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(-200)

  useEffect(() => {
    if (autoRotateSpeed === -1) return
    setTimeout(() => {
      setAutoRotateSpeed(pre => pre + 1)
    }, 10)
  }, [autoRotateSpeed])

  return (
    <CanvasContainer>
      <Canvas camera={{ fov: 65, position: [0, 0, 5] }}>
        <ambientLight intensity={0.2} />
        <Suspense fallback={null}>
          <Modal url='/farmhouse2.0.glb' />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={autoRotateSpeed}
          enableDamping
          target={[0, -1, 1]}
        />
        {/* <Stats /> */}
      </Canvas>
    </CanvasContainer>
  )
}

export default ThreejsCanvas
