import { _decorator, Component, Node, Input, log, find, AnimationComponent, Vec3, tween, PolygonCollider2D } from 'cc';
import { electron } from 'process';
import { setFlagsFromString } from 'v8';
import { AniXuoi } from './AniXuoi';
import { Req } from './Req';
const { ccclass, property } = _decorator;

@ccclass('Wood')
export class Wood extends Component {

    xuoi: boolean = false;

    isTouch: boolean = false;

    private isMovingUp: boolean = false;
    private isMovingDown: boolean = false;
    private targetPosition: Vec3 = new Vec3();
    private moveSpeed: number = 100; // Tốc độ di chuyển (px/giây)

    start() {
        this.registerTouch();
    }

    update(deltaTime: number) {

    }

    registerTouch() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    destroyTouch() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    elapsedTime: any = 0;
    onTouchStart() {
        const startTime = performance.now();
        if (!this.isTouch) {
            log('onTouchStart')
            // this.isTouch = true;
            const canVas = find('Canvas');
            if (this.xuoi) {
                this.xuoi = false;
                this.isMovingDown = true;
                // let ani = canVas.getComponent(AniXuoi).cbiXuoi;
                this.playAni(this.node, 1)
                this.tweenWood(this.node, -45);
            } else {
                this.checkMovingUp();
                this.xuoi = true;
                this.isMovingUp = true;
                this.playAni(this.node, 0);
                this.tweenWood(this.node, 45);
                Req.instance._woodNode = this.node;
            }
        } else {
            return;
        }
        const endTime = performance.now(); // Thời điểm kết thúc tính thời gian
        this.elapsedTime = endTime - startTime; // Thời gian chạy của onTouchStart
    }

    onTouchEnd() {

    }

    playAni(node: Node, index: number) {
        let ani = node.getComponent(AnimationComponent).clips[index];
        node.getComponent(AnimationComponent).defaultClip = ani;
        node.getComponent(AnimationComponent).play();
    }

    checkMovingUp(call?: CallableFunction) {
        let array = Req.instance._cbi;

        array.forEach((element, index) => {
            let isMVU = element.getComponent(Wood).isMovingUp;
            let isMVD = element.getComponent(Wood).isMovingDown;
            let isXuoi = element.getComponent(Wood).xuoi;

            if (isXuoi) {
                element.getComponent(Wood).playAni(element, 1);
                this.tweenWood(element, -45);
                element.getComponent(Wood).isMovingDown = true;
                element.getComponent(Wood).xuoi = false;
            } else {
                return;
            }
        })

        if (call) {
            call
        }
    }

    tweenWood(node: Node, data: number) {
        // node.getComponent(PolygonCollider2D).group = 8;
        tween(node).tag(1)
            .to(0.35, { position: new Vec3(node.position.x, node.position.y + data, node.position.z) })
            .call(() => {
                // node.getComponent(PolygonCollider2D).group = 2;
            })
            .start();
    }

}

