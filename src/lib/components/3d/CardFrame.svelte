<script lang="ts">
  import { T } from '@threlte/core';
  import { Shape } from 'three';

  let {
    width = 2.5,
    height = 3.5,
    radius = 0.2, // Aumenta esto a 0.2 para notar más el efecto
    depth = 0.05,
    thickness = 0.1, // Grosor del marco
    ...props
  } = $props();

  // Función interna para dibujar el camino
  function drawRoundedRect(shape: Shape | any, w: number, h: number, r: number, x = 0, y = 0) {
    shape.moveTo(x, y + r);
    shape.lineTo(x, y + h - r);
    shape.quadraticCurveTo(x, y + h, x + r, y + h);
    shape.lineTo(x + w - r, y + h);
    shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    shape.lineTo(x + w, y + r);
    shape.quadraticCurveTo(x + w, y, x + w - r, y);
    shape.lineTo(x + r, y);
    shape.quadraticCurveTo(x, y, x, y + r);
  }

  const frameShape = $derived.by(() => {
    const shape = new Shape();
    // 1. Dibujamos el exterior (sentido horario por defecto)
    drawRoundedRect(shape, width, height, radius, 0, 0);

    // 2. Dibujamos el hueco (Invertimos el sentido para que Three.js lo detecte mejor)
    const hole = new Shape();
    const innerW = width - thickness * 2;
    const innerH = height - thickness * 2;
    const innerR = Math.max(0.01, radius - (thickness * 0.5)); // Ajuste de radio interno

    drawRoundedRect(hole, innerW, innerH, innerR, thickness, thickness);
    
    shape.holes.push(hole);
    return shape;
  });

  const extrudeSettings = $derived({
    depth,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 5 // Más segmentos = curvas más suaves
  });
</script>

<T.Group position={[-width / 2, -height / 2, 0]}>
  <T.Mesh castShadow>
    <T.ExtrudeGeometry args={[frameShape, extrudeSettings]} />
    <T.MeshPhysicalMaterial {...props} />
  </T.Mesh>
</T.Group>