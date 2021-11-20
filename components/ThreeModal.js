import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Model({ url, ...props }) {
  const { scene } = useGLTF(url)

  const myScene = React.useRef()

  useFrame(({ clock, camera }) => {
    // myScene.current.rotation.y = -clock.getElapsedTime() * 0.3
  })

  return (
    <>
      <primitive
        ref={myScene}
        object={scene}
        position={[0, -2, 1]}
        // rotation={[0.4, -0.8, 0]}
        scale={[1, 1, 1]}
        {...props}
        dispose={null}
      />
    </>
  )
}
