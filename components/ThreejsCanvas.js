import {Suspense} from 'react'
import {Canvas} from '@react-three/fiber'
import Modal from './ThreeModal'
import {OrbitControls} from '@react-three/drei/core/OrbitControls'
import {CanvasContainer, CanvasLoadingSpinner} from './CanvasContainer'

function ThreejsCanvas() {
    return (
        <Suspense fallback={<CanvasLoadingSpinner />}>
            <CanvasContainer>
                <Canvas camera={{fov: 65, position: [0, 0, 5]}}>
                    <ambientLight intensity={0.2} />
                    <Modal url='/farmhouse.glb' />
                    <OrbitControls enableDamping target={[0, -1, 1]} />
                </Canvas>
            </CanvasContainer>
        </Suspense>
    )
}

export default ThreejsCanvas
