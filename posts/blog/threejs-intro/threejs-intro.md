---
title: 入门Three.js：创建你的第一个3D场景
date: 2023-02-02
excerpt: 本篇博客介绍了 Three.js 的基本概念和使用方法，包括创建场景、相机、几何体、材质和渲染器等。
cover: /2023-02-21-21-35-22.png
tags:
- Javascript
- Threejs
- 3D
---

# Three.js 入门指南

## 准备工作

在开始之前，你需要下载并安装一个文本编辑器，如 Sublime Text 或 Visual Studio Code。同时，你还需要在计算机上安装 Node.js 和 npm 包管理器。

接下来，我们需要创建一个 HTML 文件来加载 Three.js 库并显示我们的 3D 场景。在 HTML 文件中，我们需要将 Three.js 库引入并创建一个用于显示 3D 场景的容器。

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Three.js App</title>
    <meta charset="utf-8">
    <style>
        body {
            margin: 0;
            overflow: hidden;
        }
        canvas {
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <div id="container"></div>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>
    <script src="app.js"></script>
</body>
</html>

```

在这个 HTML 文件中，我们创建了一个名为 "container" 的 div 元素，用于显示 Three.js 场景。我们还引入了 Three.js 库和我们的应用程序脚本文件 "app.js"。

## 创建场景和相机

在 Three.js 中，我们需要创建一个场景（Scene）和一个相机（Camera）来渲染我们的 3D 场景。场景是所有 3D 对象的容器，而相机则决定了我们的视角和视野。

在我们的应用程序脚本文件中，我们可以创建一个场景和相机，并将相机放置在场景中心。


```JavaScript
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 将相机添加到场景中
scene.add(camera);

```


在上面的代码中，我们使用了 Three.js 中的 PerspectiveCamera 类来创建一个透视相机。这个相机有一个视角角度为 75 度，一个宽高比为窗口宽度和高度之比，以及一个近截面和远截面（0.1 和 1000）。

然后，我们将相机放置在场景的 (0, 0, 5) 位置，并将它添加到场景中。

## 创建渲染

现在我们已经有了一个场景和相机，但是我们还需要一个渲染器（Renderer）来将 3D 场景渲染到屏幕上。在 Three.js 中，我们可以使用 WebGLRenderer 类来创建一个 WebGL 渲染器。

```JavaScript
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

```

在这段代码中，我们创建了一个新的 WebGL 渲染器，并将其大小设置为浏览器窗口的大小。然后，我们将渲染器的输出附加到 HTML 中的 "container" 元素上。

## 创建对象

接下来，我们将创建一些 3D 对象来添加到场景中。在 Three.js 中，我们可以使用几何体（Geometry）和材质（Material）来创建 3D 对象。在 Three.js 中，几何体是对象的形状，而材质决定了对象的外观。

```JavaScript
// 创建几何体
const geometry = new THREE.BoxGeometry();

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// 创建网格对象
const cube = new THREE.Mesh(geometry, material);

// 将对象添加到场景中
scene.add(cube);

```

在上面的代码中，我们创建了一个立方体几何体，并将其颜色设置为绿色。然后，我们使用 MeshBasicMaterial 类创建了一个基本材质，并将其应用到立方体上。最后，我们将网格对象添加到场景中。

## 渲染场景

现在我们已经创建了场景、相机、渲染器和 3D 对象，我们需要渲染场景并将其显示到屏幕上。在 Three.js 中，我们可以使用 render 方法来渲染场景。

```JavaScript
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}
animate();

```

在上面的代码中，我们使用 requestAnimationFrame 方法来更新渲染器，以便在每个浏览器帧中重新绘制场景。我们还使用 cube.rotation.x 和 cube.rotation.y 属性来旋转立方体对象，以使其动起来。最后，我们使用 renderer.render 方法来将场景渲染到屏幕上。

## 完整代码

现在我们已经完成了 Three.js 的入门指南，让我们来看一下完整的代码。

```JavaScript
// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// 创建几何体
const geometry = new THREE.BoxGeometry();

// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
/ 创建网格对象
const cube = new THREE.Mesh(geometry, material);

// 将对象添加到场景中
scene.add(cube);

// 渲染场景
function animate() {
requestAnimationFrame(animate);
cube.rotation.x += 0.01;
cube.rotation.y += 0.01;
renderer.render(scene, camera);
}
animate();

```


在这个例子中，我们创建了一个简单的 3D 场景，其中包括一个绿色立方体和一个相机。我们使用了 Three.js 提供的各种类来创建这个场景，包括 Scene、PerspectiveCamera、WebGLRenderer、BoxGeometry、MeshBasicMaterial 和 Mesh。最后，我们使用 animate 函数来循环更新场景并将其渲染到屏幕上。

这只是一个简单的例子，但它展示了如何使用 Three.js 来创建基本的 3D 场景。你可以通过修改参数和添加其他对象来定制这个场景。同时，你还可以使用其他类和功能来创建更高级的 3D 应用程序。

## 总结

在本篇博客中，我们介绍了 Three.js 的基本概念和使用方法。我们首先创建了一个 3D 场景和相机，然后使用几何体和材质来创建 3D 对象，并将它们添加到场景中。最后，我们使用渲染器将场景渲染到屏幕上。

如果你想深入了解 Three.js，可以查看官方文档和示例，这些资源提供了丰富的学习材料和示例代码。同时，你也可以使用 Three.js 来创建更复杂的 3D 应用程序，例如游戏、可视化和交互式应用程序等。
