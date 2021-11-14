import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Model({ url, ...props }) {
  const { scene } = useGLTF(url)
  const myScene = React.useRef()
  useFrame(({ clock }) => {
    myScene.current.rotation.y = -clock.getElapsedTime() * 0.1
    console.log("Hey, I'm executing every frame!")
  })
  return (
    <primitive
      ref={myScene}
      object={scene}
      position={[0, 0, 0]}
      scale={[0.3, 0.3, 0.3]}
      {...props}
      dispose={null}
    />
  )
}
