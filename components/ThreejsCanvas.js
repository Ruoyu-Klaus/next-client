import React, { Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

let GLTFLoader

function ThreejsCanvas({ children }) {
  useEffect(() => {
    GLTFLoader = require('three/examples/jsm/loaders/GLTFLoader').GLTFLoader
  }, [])

  return (
    <Canvas>
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  )
}

export default ThreejsCanvas
