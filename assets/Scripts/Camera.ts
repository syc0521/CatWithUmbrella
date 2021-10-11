import camera, { CameraCapacity } from "@byted-creative/camera"
import { CameraCocosLayer } from "@byted-creative/camera-cocos-layer"
import face, { Face, FaceEvent, FaceDebug, FaceInfo } from "@byted-creative/camera-face"
import GameManager from "./GameManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CameraComponent extends cc.Component 
{
    @property(GameManager)
    gameManager: GameManager = null

    async onLoad()
    {
        camera.init({
            debug: true,
            direction: 'front', // 开启的是前置摄像头, 后置的值为backend
            layerAdapter: new CameraCocosLayer({
                root: this.node, //  该值为cocos creator 的cc.Node节点，用来显示摄像头内容
            }),
            capacity: [CameraCapacity.Face]
        })
        await camera.start().then(() =>
        {
            face.init({ interval: 30 })
            face.startDetect()
            face.on(FaceEvent.onFaceInfos, this.onFaceInfos, this);
            face.on(FaceEvent.onHeadPitch, this.startGame, this);
        })
    }

    private startGame()
    {
        face.off(FaceEvent.onHeadPitch, this.startGame, this)
        this.gameManager.startGame()
    }

    private onFaceInfos(faceInfos: FaceInfo[])
    {
        if (faceInfos.length > 0)
        {
            const point = faceInfos[0].nose[4]
            this.gameManager.moveUmbrella(point.x)
        }
    }
}
