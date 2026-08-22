<template>
  <div class="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
    <svg 
      viewBox="0 0 500 500" 
      class="w-full h-full select-none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Composting cycle diagram: Grow, Food, Scraps, Compost, Fertilizer"
      role="img"
    >
      <defs>
        <!-- Arrow marker for clockwise connectors -->
        <marker 
          id="arrow-head" 
          viewBox="0 0 10 10" 
          refX="6" 
          refY="5" 
          markerWidth="6" 
          markerHeight="6" 
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#7A4D30" />
        </marker>
        
        <!-- Drop shadow for compost/crate elements -->
        <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.1" />
        </filter>
      </defs>

      <!-- 1. Background Recycle Watermark Logo (Center) -->
      <g transform="translate(250, 250) scale(1.15)" opacity="0.04" fill="#000000">
        <path d="M-15,-60 L-35,-20 L-20,-20 L-30,10 L-10,10 L-10,-5 L10,-5 L10,10 L30,10 L20,-20 L35,-20 Z" />
        <!-- Standard recycle symbol simplified -->
        <path d="M -40,-20 C -60,0 -60,30 -40,50 C -20,70 10,70 30,50 L 20,40 C 5,55 -20,55 -32,40 C -45,25 -45,5 -30,-10 Z" />
        <path d="M 40,30 L 60,-10 L 45,-10 L 55,-40 L 35,-40 L 35,-25 L 15,-25 L 15,-40 L -5,-40 L 5,-10 L -10,-10 Z" />
        <!-- Custom clean 3-arrow recycle icon vector -->
        <g transform="scale(0.8)">
          <path d="M 0,-60 L 25,-20 L 10,-20 C 15,10 -5,40 -35,45 L -35,32 C -15,28 -3,7 -7,-20 L -22,-20 Z" />
          <path d="M 52,15 L 10,40 L 18,27 C -10,20 -32,-3 -32,-38 L -20,-38 C -20,-13 -3,3 20,8 L 12,-5 Z" />
          <path d="M -52,45 L -35,-20 L -27,-8 C -5,-30 17,-37 45,-15 L 37,-5 C 15,-20 -2,-13 -13,8 L -5,3 Z" />
        </g>
      </g>

      <!-- 2. Connection Arrows (Clockwise) -->
      <!-- Grow (110, 210) -> Food (250, 95) -->
      <path 
        d="M 115 170 C 135 110, 180 85, 222 80" 
        fill="none" 
        stroke="#7A4D30" 
        stroke-width="3" 
        stroke-dasharray="2 1"
        marker-end="url(#arrow-head)" 
      />
      <!-- Food (250, 95) -> Scraps (390, 210) -->
      <path 
        d="M 278 80 C 320 85, 365 110, 385 170" 
        fill="none" 
        stroke="#7A4D30" 
        stroke-width="3" 
        stroke-dasharray="2 1"
        marker-end="url(#arrow-head)" 
      />
      <!-- Scraps (390, 210) -> Compost (330, 360) -->
      <path 
        d="M 390 270 C 385 305, 370 330, 350 350" 
        fill="none" 
        stroke="#7A4D30" 
        stroke-width="3" 
        stroke-dasharray="2 1"
        marker-end="url(#arrow-head)" 
      />
      <!-- Compost (330, 360) -> Fertilizer (170, 360) -->
      <path 
        d="M 300 375 C 265 378, 235 378, 200 375" 
        fill="none" 
        stroke="#7A4D30" 
        stroke-width="3" 
        stroke-dasharray="2 1"
        marker-end="url(#arrow-head)" 
      />
      <!-- Fertilizer (170, 360) -> Grow (110, 210) -->
      <path 
        d="M 150 350 C 130 330, 115 305, 110 270" 
        fill="none" 
        stroke="#7A4D30" 
        stroke-width="3" 
        stroke-dasharray="2 1"
        marker-end="url(#arrow-head)" 
      />

      <!-- 3. Stage Icons & Labels -->

      <!-- STAGE: FOOD (Top Center) -->
      <g transform="translate(250, 90)">
        <!-- Apple -->
        <circle cx="-14" cy="-25" r="16" fill="#8D5A38" />
        <path d="M-14 -41 Q-10 -35 -11 -28" stroke="#5C6E58" stroke-width="2" fill="none" />
        <!-- Carrot -->
        <path d="M5 -32 L20 -10 C21 -8 18 -6 16 -8 L2 -26 Z" fill="#A06A42" />
        <path d="M2 -26 Q-3 -31 -5 -27 Q-3 -23 2 -26" fill="#5C6E58" />
        <!-- Pear / Fig -->
        <path d="M-4 -12 C-10 -12 -12 -18 -8 -24 C-6 -27 -2 -27 0 -24 C4 -18 2 -12 -4 -12 Z" fill="#7C5D43" />
        <!-- Label -->
        <text 
          x="0" 
          y="15" 
          text-anchor="middle" 
          class="text-xs font-bold uppercase tracking-wider fill-[#7A4D30]"
        >
          Food
        </text>
      </g>

      <!-- STAGE: SCRAPS (Upper Right) -->
      <g transform="translate(390, 215)">
        <!-- Wheelie Bin (Trash Can) -->
        <g filter="url(#soft-shadow)">
          <!-- Bin Body -->
          <path d="M-22 -15 L22 -15 L16 35 L-16 35 Z" fill="#4E606B" />
          <!-- Bin Lid -->
          <path d="M-26 -22 L26 -22 C28 -22 28 -15 26 -15 L-26 -15 C-28 -15 -28 -22 -26 -22 Z" fill="#3D4F5A" />
          <!-- Bin Handle -->
          <path d="M-12 -22 L-12 -28 L12 -28 L12 -22" stroke="#3D4F5A" stroke-width="3" fill="none" />
          <!-- White Recycle Icon on Bin -->
          <g transform="translate(0, 8) scale(0.25)" fill="#FFFFFF" opacity="0.9">
            <path d="M 0,-25 L 12,-5 L 5,-5 C 7,8 -3,20 -18,22 L -18,16 C -8,14 -2,4 -4,-10 L -11,-10 Z" />
            <path d="M 24,7 L 5,18 L 9,12 C -5,9 -15,-1 -15,-17 L -9,-17 C -9,-6 -1,1 10,4 L 6,-2 Z" />
            <path d="M -24,18 L -17,-10 L -13,-4 C -2,-14 8,-17 21,-7 L 17,-2 C 7,-10 -1,-7 -6,3 L -2,1 Z" />
          </g>
        </g>
        <!-- Apple Core scrap next to bin -->
        <path d="M-36 10 C-36 6 -32 4 -30 7 L-30 25 C-32 28 -36 26 -36 22 Z" fill="#CBB69E" />
        <path d="M-30 11 L-30 21" stroke="#5C6E58" stroke-width="3" />
        <circle cx="-30" cy="16" r="1.5" fill="#4E606B" />
        <!-- Banana peel scrap -->
        <path d="M-32 28 Q-24 24 -18 32 Q-22 35 -32 28 Z" fill="#8D7A5D" />
        <!-- Label -->
        <text 
          x="0" 
          y="56" 
          text-anchor="middle" 
          class="text-xs font-bold uppercase tracking-wider fill-[#7A4D30]"
        >
          Scraps
        </text>
      </g>

      <!-- STAGE: COMPOST (Bottom Right) -->
      <g transform="translate(330, 360)">
        <!-- Wooden Crate box -->
        <g filter="url(#soft-shadow)">
          <!-- Crate Box Base -->
          <rect x="-45" y="-10" width="90" height="50" rx="3" fill="#A88062" />
          <!-- Slats (Visual slats with darker horizontal bars) -->
          <rect x="-42" y="-6" width="84" height="10" fill="#936D52" />
          <rect x="-42" y="8" width="84" height="10" fill="#936D52" />
          <rect x="-42" y="22" width="84" height="10" fill="#936D52" />
          <!-- Vertical posts -->
          <rect x="-45" y="-10" width="10" height="50" fill="#846046" />
          <rect x="35" y="-10" width="10" height="50" fill="#846046" />
          <!-- Soil inside crate -->
          <path d="M-35 -10 Q0 -18 35 -10 L35 0 L-35 0 Z" fill="#5A4535" />
        </g>
        <!-- Shovel/Spade standing in compost -->
        <g transform="rotate(-30, -5, -15)">
          <path d="M-5 -45 L5 -45 L5 -10 L-5 -10 Z" fill="#BAC3C7" />
          <path d="M-10 -10 L10 -10 L8 12 L-8 12 Z" fill="#919CA1" />
          <path d="M-2 -45 L-2 -75 L2 -75 L2 -45" stroke="#7A4D30" stroke-width="4" fill="none" />
          <circle cx="0" cy="-78" r="6" stroke="#7A4D30" stroke-width="3" fill="none" />
        </g>
        <!-- Label -->
        <text 
          x="0" 
          y="62" 
          text-anchor="middle" 
          class="text-xs font-bold uppercase tracking-wider fill-[#7A4D30]"
        >
          Compost
        </text>
      </g>

      <!-- STAGE: FERTILIZER (Bottom Left) -->
      <g transform="translate(170, 360)">
        <!-- Heap of Soil -->
        <path d="M-45 35 C-45 10 -25 -5 0 -5 C25 -5 45 10 45 35 Z" fill="#5A4535" filter="url(#soft-shadow)" />
        <!-- Sprout growing out -->
        <g transform="translate(0, -2)">
          <!-- Stem -->
          <path d="M0 5 Q3 -10 12 -22" fill="none" stroke="#5C6E58" stroke-width="4" stroke-linecap="round" />
          <!-- Leaf 1 -->
          <path d="M12 -22 C6 -24 3 -16 6 -12 C9 -8 11 -15 12 -22 Z" fill="#5C6E58" />
          <!-- Leaf 2 -->
          <path d="M6 -14 C1 -12 -2 -6 2 -3 C6 0 7 -7 6 -14 Z" fill="#4E5D4A" />
        </g>
        <!-- Small plant helper sprout -->
        <path d="M-18 15 Q-15 5 -10 0" fill="none" stroke="#5C6E58" stroke-width="2.5" />
        <!-- Label -->
        <text 
          x="0" 
          y="62" 
          text-anchor="middle" 
          class="text-xs font-bold uppercase tracking-wider fill-[#7A4D30]"
        >
          Fertilizer
        </text>
      </g>

      <!-- STAGE: GROW (Middle Left) -->
      <g transform="translate(110, 215)">
        <!-- Soil Base -->
        <path d="M-30 25 C-30 18 -15 12 0 12 C15 12 30 18 30 25 Z" fill="#5A4535" />
        <!-- Plant Branch -->
        <g transform="translate(0, 15)">
          <!-- Main branch stem -->
          <path d="M0 10 Q-5 -25 15 -50" fill="none" stroke="#7A4D30" stroke-width="4.5" stroke-linecap="round" />
          <!-- Branch shoot -->
          <path d="M1 -15 Q-18 -28 -14 -40" fill="none" stroke="#7A4D30" stroke-width="3" stroke-linecap="round" />
          <!-- Large Leaf 1 -->
          <path d="M15 -50 C18 -58 10 -64 5 -58 C0 -52 8 -46 15 -50 Z" fill="#5C6E58" />
          <!-- Large Leaf 2 -->
          <path d="M-14 -40 C-22 -42 -24 -34 -18 -30 C-12 -26 -10 -34 -14 -40 Z" fill="#4E5D4A" />
          <!-- Middle Leaf -->
          <path d="M7 -32 C14 -32 16 -24 10 -22 C4 -20 2 -27 7 -32 Z" fill="#5C6E58" />
          <!-- Small lower leaf -->
          <path d="M-4 -6 C-10 -4 -10 2 -6 2 C-2 2 -1 -3 -4 -6 Z" fill="#4E5D4A" />
        </g>
        <!-- Label -->
        <text 
          x="0" 
          y="56" 
          text-anchor="middle" 
          class="text-xs font-bold uppercase tracking-wider fill-[#7A4D30]"
        >
          Grow
        </text>
      </g>
    </svg>
  </div>
</template>
