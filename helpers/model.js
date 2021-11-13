import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function loadGLTFModel(
  setModel,
  glbPath,
  options = { receiveShadow: true, castShadow: true }
) {
  return new Promise((resolve, reject) => {
    const { receiveShadow, castShadow } = options
    const loader = new GLTFLoader()
    loader.load(
      glbPath,
      gltf => {
        const obj = gltf.scene
        obj.name = 'farm_yard'
        obj.position.y = 0
        obj.position.x = 0
        obj.scale.x = 0.4
        obj.scale.y = 0.4
        obj.scale.z = 0.4
        obj.receiveShadow = receiveShadow
        obj.castShadow = castShadow
        setModel(obj)

        obj.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = castShadow
            child.receiveShadow = receiveShadow
          }
        })
        resolve(obj)
      },
      undefined,
      function (error) {
        reject(error)
      }
    )
  })
}
