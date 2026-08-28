// Organic force-directed layout used by the Empire map.
// The graph intentionally has a little more randomness than a textbook force graph:
// related nodes form local "pockets", category centres act as soft gravity, and collision
// forces only kick in when bubbles actually get too close.

export const CATEGORY_ORDER = ['Technology', 'Business', 'Science', 'Culture', 'Places', 'Wildcard'];

export const CATEGORY_TONE = {
  Technology: 'mint',
  Business: 'lavender',
  Science: 'cyan',
  Culture: 'peach',
  Places: 'gold',
  Wildcard: 'rose'
};

const SUBCLUSTERS = {
  Technology: [[300,250],[525,285],[395,430]],
  Business: [[810,245],[1035,315],[805,455]],
  Science: [[300,720],[535,690],[405,875]],
  Culture: [[800,730],[1060,700],[900,900]],
  Places: [[1370,250],[1575,335],[1370,470]],
  Wildcard: [[1325,720],[1560,725],[1440,930]]
};

function hash(value) {
  let h = 2166136261;
  for (let i=0;i<value.length;i++) h = Math.imul(h ^ value.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

function rand(id, salt) { return hash(`${id}:${salt}`); }

export function bubbleSize(price) {
  if (price >= 100) return 112;
  if (price >= 50) return 98;
  if (price >= 25) return 86;
  return 72;
}

function choosePocket(node, links) {
  const neighbours = links.filter(([a,b]) => a === node.id || b === node.id).map(([a,b]) => a === node.id ? b : a);
  if (!neighbours.length) return Math.floor(rand(node.id,'pocket') * 3);
  const score = neighbours.reduce((sum,id) => sum + Math.floor(rand(id,'pocket') * 3), 0);
  return score % 3;
}

export function createOrganicLayout(nodes, links, width=1820, height=1080) {
  const byId = Object.fromEntries(nodes.map(n => [n.id,n]));
  const state = Object.fromEntries(nodes.map((n,i) => {
    const pockets = SUBCLUSTERS[n.category] || [[width/2,height/2]];
    const p = pockets[choosePocket(n,links) % pockets.length];
    const angle = rand(n.id,'angle') * Math.PI * 2;
    const radius = 20 + rand(n.id,'radius') * 92;
    const wobbleX = (rand(n.id,'x') - .5) * 70;
    const wobbleY = (rand(n.id,'y') - .5) * 55;
    return [n.id,{...n,x:p[0] + Math.cos(angle)*radius + wobbleX,y:p[1] + Math.sin(angle)*radius + wobbleY,vx:0,vy:0,pocket:p}];
  }));

  const list = Object.values(state);
  const activeLinks = links.filter(([a,b]) => byId[a] && byId[b]);

  for(let tick=0;tick<520;tick++) {
    const cooling = 1 - tick/520;

    for(const n of list) {
      n.vx *= .80;
      n.vy *= .80;

      // Strong local pocket gravity keeps each niche organically clustered rather than grid-like.
      const local = 0.0105 + cooling * 0.004;
      n.vx += (n.pocket[0] - n.x) * local;
      n.vy += (n.pocket[1] - n.y) * local;

      // Much weaker category gravity gives each niche a broad footprint.
      const centre = CATEGORY_CENTRES[n.category] || [width/2,height/2];
      n.vx += (centre[0] - n.x) * 0.00125;
      n.vy += (centre[1] - n.y) * 0.00125;

      // Tiny deterministic wander prevents perfect symmetry.
      const phase = tick * .018 + rand(n.id,'wander') * 10;
      n.vx += Math.cos(phase) * .018;
      n.vy += Math.sin(phase * .83) * .018;
    }

    // Pairwise separation. Repulsion falls off quickly once nodes are comfortably apart.
    for(let i=0;i<list.length;i++) {
      for(let j=i+1;j<list.length;j++) {
        const a=list[i], b=list[j];
        let dx=b.x-a.x, dy=b.y-a.y;
        let d=Math.hypot(dx,dy) || .001;
        const gap=bubbleSize(a.price)/2 + bubbleSize(b.price)/2 + 22;
        if(d < gap) {
          const f=(gap-d)*0.115;
          const nx=dx/d, ny=dy/d;
          a.vx -= nx*f; a.vy -= ny*f;
          b.vx += nx*f; b.vy += ny*f;
        } else if(d < 240) {
          const f=28/(d*d);
          const nx=dx/d, ny=dy/d;
          a.vx -= nx*f; a.vy -= ny*f;
          b.vx += nx*f; b.vy += ny*f;
        }
      }
    }

    // Related concepts pull together. Stronger links mean tighter local constellations.
    for(const [aId,bId,weight] of activeLinks) {
      const a=state[aId], b=state[bId];
      let dx=b.x-a.x, dy=b.y-a.y;
      let d=Math.hypot(dx,dy) || .001;
      const ideal=112 - Math.min(34, weight*10) + (rand(a.id+b.id,'ideal')-.5)*18;
      const f=(d-ideal)*0.0105*weight;
      const nx=dx/d, ny=dy/d;
      a.vx += nx*f; a.vy += ny*f;
      b.vx -= nx*f; b.vy -= ny*f;
    }

    // Keep categories from collapsing into each other.
    for(let i=0;i<list.length;i++) for(let j=i+1;j<list.length;j++) {
      const a=list[i],b=list[j];
      if(a.category===b.category) continue;
      const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||.001;
      if(d<310) {
        const f=(310-d)*0.0022;
        const nx=dx/d,ny=dy/d;
        a.vx-=nx*f;a.vy-=ny*f;b.vx+=nx*f;b.vy+=ny*f;
      }
    }

    for(const n of list) {
      const maxSpeed=2.7;
      n.vx=Math.max(-maxSpeed,Math.min(maxSpeed,n.vx));
      n.vy=Math.max(-maxSpeed,Math.min(maxSpeed,n.vy));
      n.x += n.vx;
      n.y += n.vy;
      n.x=Math.max(75,Math.min(width-75,n.x));
      n.y=Math.max(75,Math.min(height-75,n.y));
    }
  }

  return list.map(({vx,vy,pocket,...node})=>node);
}

export const CATEGORY_CENTRES = {
  Technology:[420,350], Business:[900,350], Science:[420,770], Culture:[900,770], Places:[1430,350], Wildcard:[1430,770]
};

export function linkedNodeSet(hovered, links) {
  if(!hovered) return new Set();
  const set=new Set([hovered]);
  links.forEach(([a,b])=>{ if(a===hovered)set.add(b); if(b===hovered)set.add(a); });
  return set;
}
