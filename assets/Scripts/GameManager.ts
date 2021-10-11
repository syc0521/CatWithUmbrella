import Rain from "./Rain";
import Rabbit from "./Rabbit"
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component
{
    @property(cc.Node)
    umbrella: cc.Node = null
    @property(cc.Prefab)
    rain: cc.Prefab = null
    @property(cc.Node)
    rainWrapNode: cc.Node = null
    @property(cc.Node)
    rabbit: cc.Node = null
    @property(cc.Label)
    timeLabel: cc.Label = null
    @property(cc.Node)
    startNode: cc.Node = null
    @property(cc.Node)
    stateNode: cc.Node = null
    @property(cc.Animation)
    anim: cc.Animation = null
    @property([cc.SpriteFrame])
    sprites: cc.SpriteFrame[] = []

    private _rainPool: cc.NodePool = new cc.NodePool()
    private readonly _positionY = 1100
    private _time: number = 15.00
    private running: boolean = false
    private complete = false
    private lastPosition: number = 0

    putRain(Rain: cc.Node)
    {
        this._rainPool.put(Rain)
    }

    moveUmbrella(position: number)
    {
        if (this.running)
        {
            this.umbrella.setPosition(position, this.umbrella.position.y)
        }
    }

    startGame()
    {
        this.running = true
        this.rabbit.getComponent(Rabbit).setStart()
        this.timeLabel.enabled = true
        this.startNode.active = false
        this._time = 10
        this.schedule(function () 
        {
            for (let i = 0; i < 2; i++) 
            {
                this.createRain(cc.v3((Math.random() - 0.5) * 1200, this._positionY))
            }

        }, 0.06);
    }

    onLoad()
    {
        this.timeLabel.enabled = false
        this.rabbit.getComponent(Rabbit).setManager(this)
        cc.director.getCollisionManager().enabled = true
        //cc.director.getCollisionManager().enabledDebugDraw = true
        for (let index = 0; index < 500; index++)
        {
            const temp = cc.instantiate(this.rain)
            this._rainPool.put(temp)
        }
    }

    update(dt: number) 
    {
        this.ShowTime(dt)
        if (this.running)
        {
            this.ChangeState()
        }
    }

    private ChangeState()
    {
        if (this.rabbit.position.x - this.lastPosition > 0)
        {
            let state = this.anim.play('Right')
            state.wrapMode = cc.WrapMode.Loop
        }
        else if (this.rabbit.position.x - this.lastPosition < 0)
        {
            let state = this.anim.play('Left')
            state.wrapMode = cc.WrapMode.Loop
        }
        this.lastPosition = this.rabbit.position.x
    }

    private ShowTime(dt: number)
    {
        if (this._time < 0 && !this.complete)
        {
            this._time = 0;
            this.gameComplete();
            this.complete = true;
        }
        if (this._time > 0 && this.running)
        {
            this._time -= dt;
            this.timeLabel.string = this._time.toFixed(2);
        }
        else { this.timeLabel.string = "0.00"; }
    }

    gameOver()
    {
        //this.unscheduleAllCallbacks()
        this.putAllRain()
        this.stateNode.active = true
        this.stateNode.getComponent(cc.Sprite).spriteFrame = this.sprites[0]
        this.anim.play('Over')
    }

    gameComplete()
    {
        //this.unscheduleAllCallbacks()
        this.putAllRain()
        this.stateNode.active = true
        this.stateNode.getComponent(cc.Sprite).spriteFrame = this.sprites[1]
    }

    createRain(positionX: cc.Vec3)
    {
        let rainNode: cc.Node = null
        if (this._rainPool.size() > 0)
        {
            rainNode = this._rainPool.get()
        }
        else
        {
            rainNode = cc.instantiate(this.rain)
        }
        this.rainWrapNode.addChild(rainNode)
        rainNode.getComponent(Rain).Create(positionX)
        rainNode.getComponent(Rain).setManager(this)
    }

    putAllRain()
    {
        this.rabbit.getComponent(Rabbit).setOver()
        this.running = false
        this.umbrella.active = false
        this.rainWrapNode.active = false
        this.timeLabel.enabled = false
        //this.rainWrapNode.children.forEach((node) => this._rainPool.put(node))
    }

}
