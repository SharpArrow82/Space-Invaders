const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#ScoreEl')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

class Player{
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1
        const image = new Image()
        image.src = './img/Spaceship2.png'
        image.onload = () => {
            const scale = 0.15
            this.image = image
            this.width = image.width
            this.height = image.height
            this.position = {
                x: canvas.width / 2 - image.width,
                y: canvas.height - image.height - 20
            }
        }
    }

    draw() {
        
    }

    update() {
        if(this.image){
        //this.draw()
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        c.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height)
        c.restore()
        this.position.x += this.velocity.x
        }
    }
}

class Projectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 4
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Particle{
    constructor({position, velocity, radius, color, fades}){
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fades)
        this.opacity -= 0.01
    }
}

class Invader{
    constructor({position}) {
        this.velocity = {
            x: 0,
            y: 0
        }
        const image = new Image()
        image.src = './img/Invader.png'
        image.onload = () => {
            
            this.image = image
            this.width = image.width
            this.height = image.height
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }

    draw() {
        
    }

    update({velocity}) {
        if(this.image){
        //this.draw()
        
        c.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height)
        this.position.x += velocity.x
        this.position.y += velocity.y
        }
    }

    shoot(InvaderProjectiles) {
        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class InvaderProjectile{
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity

        this.width = 6
        this.height = 15
    }

    draw(){
        c.fillStyle = 'yellow'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

    shoot(InvaderProjectiles) {
        InvaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}

class Grid{
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }

        this.invaders = []
        const columns = Math.floor(Math.random() * 10 + 2)
        const rows = Math.floor(Math.random() * 5 + 2)

        this.width = columns * 30
        for(let i = 0; i < columns; i++){
            for(let y = 0; y < rows; y++){
            this.invaders.push(new Invader({position: {
                x: i * 32,// + canvas.width / 2.5,
                y: y * 35
            }}))
        }
        }
    }

    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0
        if(this.position.x + this.width >= canvas.width || this.position.x <= 0)
        {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []
const InvaderProjectiles = []
const particles = []
const Keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}
player.draw()

function createStars(){
    for(let i = 0; i < 1 ; i++){
        particles.push(new Particle({
            position: {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            },
            velocity:{
                x: 0,
                y: 2
            },
            radius: Math.random() * 3,
            color: 'white',
            fades: false
        }))
    }
}


function createParticles({object, color}){
    for(let i = 0; i < 15 ; i++){
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity:{
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || 'pink',
            fades: true
        }))
    }
}

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
    over: false,
    active: true
}
let score = 0
function animate()
{
    if(!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    if(frames % 20 === 0)
    {
    createStars()
    }
    player.update()
    //console.log(player.width)
    //console.log(player.position.x)

    particles.forEach((particle, i) => {
        if(particle.opacity <= 0){
            setTimeout(() => {
            particles.splice(i, 1)
            },0)
        }
        else
        {
        particle.update()
        }
    })

    InvaderProjectiles.forEach((InvaderProjectile, index) => {
        if(InvaderProjectile.position.y + InvaderProjectile.height >= canvas.height){
            setTimeout(() => {
                InvaderProjectiles.splice(index, 1)
            }, 0)
        }else
        InvaderProjectile.update()
        //projectile hits player
        if(InvaderProjectile.position.y + InvaderProjectile.height >= player.position.y && InvaderProjectile.position.x >= player.position.x
            && InvaderProjectile.position.x <= player.position.x + player.width){
                console.log('Lost')
                setTimeout(() => {
                    InvaderProjectiles.splice(index, 1)
                    player.opacity = 0
                game.over = true
                }, 0)
                setTimeout(() => {
                    game.active = false
                }, 2000)
                
                createParticles({object: player, color: 'white', fades: true})
            }
    })

    projectiles.forEach((projectile, index) => {
        if(projectile.position.y + projectile.radius <= 0)
        {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0);
        } else{
        projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        if(frames % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(InvaderProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })
            //projectile hits enemy
            projectiles.forEach((projectile, j) => {
                if(projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x  + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y){
                        score += 100
                        scoreEl.innerHTML = score
                    createParticles({object: invader, color: 'pink', fades: true})
                    setTimeout(() => {
                        grid.invaders.splice(i, 1)
                        projectiles.splice(j, 1)

                        if(grid.invaders.length > 0){
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length - 1]
                            grid.width = lastInvader.position.x - firstInvader.position.x
                        }
                        else{
                            grids.splice(gridIndex, 1)
                        }
                    })
                }
            })
        })
    })

    if(Keys.a.pressed && player.position.x >= 0)
    {
        player.velocity.x = -8
        player.rotation = -0.15
    }
    else if(Keys.d.pressed && player.position.x + player.image.width <= canvas.width)
    {
        player.velocity.x = 8
        player.rotation = 0.15
    }
    else
    {
        player.velocity.x = 0
        player.rotation = 0
    }

    //console.log(randomInterval)
    //console.log(frames)
if(frames % randomInterval === 0)
{
    grids.push(new Grid())
}

    frames++
}

animate()

addEventListener('keydown', ({ key }) => {
    if(game.over) return
    switch(key)
    {
        case 'a':
            //console.log('Left')
            Keys.a.pressed = true
            break;
        case 'd':
            //console.log('Right')
            Keys.d.pressed = true
            break;
        case ' ':
            
            Keys.space.pressed = true
            projectiles.push(
                new Projectile({
                    position:{
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity:{
                        x: 0,
                        y: -10
                    }
                })
            )
            //console.log(projectiles)
            break;
        case 'A':
            Keys.a.pressed = true
            break;
        case 'D':
            Keys.d.pressed = true
            break;
    }

})

addEventListener('keyup', ({ key }) => {
    switch(key)
    {
        case 'a':
            //console.log('Left') 
            Keys.a.pressed = false
            break;
        case 'd':
            //console.log('Right')
            Keys.d.pressed = false
            break;
        case ' ':
            //console.log('Space')
            Keys.space.pressed = false
            break;
        case 'A':
                Keys.a.pressed = false
                break;
        case 'D':
                Keys.d.pressed = false
                break;
    }
})