import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rain extends cc.Component
{

    @property
    speed = 10.0;
    private _gameManager: GameManager = null
    private _isCollide = false

    setManager(manager: GameManager)
    {
        this._gameManager = manager
    }

    update(dt)
    {
        this.node.setPosition(this.node.position.x, this.node.position.y - this.speed)
        if (this.node.position.y < -515 || this._isCollide)
        {
            this._gameManager.putRain(this.node)
        }
    }

    Create(Position: cc.Vec3)
    {
        this.node.position = Position
    }

    setSpeed(speed: number)
    {
        this.speed = speed
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider)  
    {
        if (other.name.match("umbrella"))
        {
            this._isCollide = true
        }
    }
}
