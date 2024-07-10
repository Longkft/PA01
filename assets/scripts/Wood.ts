import { _decorator, Component, Node, Input, log, find, AnimationComponent, Vec3, tween, PolygonCollider2D, RigidBody2D, ERigidBody2DType } from 'cc';
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
        // log('Req.instance._piece: ', Req.instance._piece)
    }

    registerTouch() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        find('Canvas').on(Input.EventType.TOUCH_START, this.onTouchStartCanvas, this);
    }

    destroyTouch() {
        this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStartCanvas() {
        if (!Req.instance._flag) {
            log('onTouchStartCanvas---------')
            Req.instance._flag = true;
            let arrayCbi = Req.instance._cbi;
            arrayCbi.forEach(element => {
                let rb = element.getComponent(RigidBody2D);
                if (!rb) {
                    rb = element.addComponent(RigidBody2D);
                }
                rb.group = 2;
                rb.type = ERigidBody2DType.Static;
                rb.gravityScale = 0;
                rb.allowSleep = true;
                rb.awakeOnLoad = true;

                // Thêm hoặc kích hoạt lại collider
                let collider = element.getComponent(PolygonCollider2D);
                if (!collider) {
                    // Thêm collider nếu chưa có
                    collider = element.addComponent(PolygonCollider2D); // Thay đổi loại collider nếu cần
                }

                // Cập nhật hoặc kích hoạt lại collider
                collider.enabled = false;
                collider.enabled = true;

                Req.instance._cbiRg.push(element);
            })

            let arrayItem = Req.instance._item;
            arrayItem.forEach(element => {
                let rb = element.getComponent(RigidBody2D);
                if (!rb) {
                    rb = element.addComponent(RigidBody2D);
                }
                rb.group = 4;
                rb.type = ERigidBody2DType.Static;
                rb.gravityScale = 0;
                rb.allowSleep = true;
                rb.awakeOnLoad = true;

                // Thêm hoặc kích hoạt lại collider
                let collider = element.getComponent(PolygonCollider2D);
                if (!collider) {
                    // Thêm collider nếu chưa có
                    collider = element.addComponent(PolygonCollider2D); // Thay đổi loại collider nếu cần
                }

                // Cập nhật hoặc kích hoạt lại collider
                collider.enabled = false;
                collider.enabled = true;

                Req.instance._itemRg.push(element);
            })

            Req.instance._nodesToHandle1 = [...Req.instance._itemRg, ...Req.instance._cbiRg]
        }
    }

    elapsedTime: any = 0;
    onTouchStart() {
        this.onTouchStartCanvas();
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

