import GameManager from "./GameManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Rabbit extends cc.Component
{

    @property
    speed = 6

    @property
    maxPositionX = 360
    public isStart = false
    private reverseTime = 3.0
    private _gameManager: GameManager = null

    setManager(manager: GameManager)
    {
        this._gameManager = manager
    }

    start() 
    {
        this.schedule(function () 
        {
            this.reverseSpeed()
            this.reverseTime -= 0.15
        }, this.reverseTime);
    }

    update(dt) 
    {
        if (this.isStart)
        {
            this.node.setPosition(this.node.position.x + this.speed, this.node.position.y)
            if (this.node.position.x > this.maxPositionX || this.node.position.x < -this.maxPositionX)
            {
                this.reverseSpeed()
            }
        }
    }

    reverseSpeed()
    {
        this.speed = -this.speed
    }

    setStart()
    {
        this.isStart = true
    }

    setOver()
    {
        this.isStart = false
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider)  
    {
        if (other.name.match("rain"))
        {
            console.log('over')
            this._gameManager.gameOver()
        }
    }
}
