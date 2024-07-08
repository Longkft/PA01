import { _decorator, Component, Node, Input, log, tween, Vec3, UITransform, RigidBody2D, PolygonCollider2D, ERigidBody2DType, HingeJoint2D, Vec2, warn, v2 } from 'cc';
import { Req } from './Req';
import { Wood } from './Wood';
const { ccclass, property } = _decorator;

@ccclass('Hold')
export class Hold extends Component {

    start() {
        this.registerTouch();
        this.distribution();
    }

    update(deltaTime: number) {

    }

    registerTouch() {
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    destroyTouch() {
        this.node.off(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    checkInputCbi() {

    }

    touchStart() {
        if (Req.instance._woodNode) {
            log('touchStart-hold')

            const woodNode = Req.instance._woodNode;
            let posThisNode = this.node.position;

            woodNode.getComponent(PolygonCollider2D).group = 8;

            tween(Req.instance._woodNode).tag(2)
                .to(0.3, { position: new Vec3(posThisNode.x, posThisNode.y + 45, posThisNode.z) })
                .call(() => {
                    const woodNodeComponent = woodNode.getComponent(Wood);
                    woodNode.getComponent(PolygonCollider2D).group = 2;
                    woodNodeComponent.playAni(woodNode, 1);
                    woodNodeComponent.tweenWood(woodNode, -45);
                    woodNodeComponent.xuoi = false;
                    Req.instance._woodNode = null;


                    this.checkRigid();
                })
                .start();

        }
    }

    checkRigid() {
        let oneCbi = Req.instance._oneCbi;
        let otherCbi = Req.instance._otherCbi;

        oneCbi.forEach(element => {
            let listChild = element.children;
            listChild.forEach((ele, i) => {
                let name = ele.name;
                let fildName = name.replace(/[0-9-]/g, '');
                if (fildName === 'hold') {
                    if (!this.isNodeCovered(ele)) {
                        const rb = ele.parent.getComponent(RigidBody2D);
                        if (rb) {
                            const force = new Vec2(0, -1000); // Tăng giá trị Y để tăng lực rơi
                            rb.applyForceToCenter(force, true);
                            // ele.parent.getComponent(PolygonCollider2D).group = 16;
                            rb.type = ERigidBody2DType.Dynamic;  // Thiết lập loại RigidBody
                            rb.gravityScale = 10;
                        }
                    }
                }
            })
        });

        otherCbi.forEach(element => {
            let listChild = element.children;

            let countHold = 0;
            let nodeLastCbi = null;
            let nodeLast = null;
            log('element: ', element)
            listChild.forEach((ele, i) => {
                let name = ele.name;
                let filName = name.replace(/[0-9-]/g, '');

                if (filName === 'hold') {
                    // countHold++;
                    if (!this.isNodeCovered(ele)) {
                        // countHold--;
                        log(false)
                        // ele.parent.getComponent(PolygonCollider2D).group = 16;
                        // ele.parent.getComponent(RigidBody2D).type = ERigidBody2DType.Dynamic;  // Thiết lập loại RigidBody
                    } else {
                        countHold++;
                        nodeLastCbi = ele;
                        nodeLast = element;
                        log(true)
                    }
                }
            });
            log('countHold: ', countHold)

            if (countHold === 0) {
                const rb = element.getComponent(RigidBody2D);
                if (rb) {
                    const force = new Vec2(0, -1000); // Tăng giá trị Y để tăng lực rơi
                    rb.applyForceToCenter(force, true);
                    // ele.parent.getComponent(PolygonCollider2D).group = 16;
                    rb.type = ERigidBody2DType.Dynamic;  // Thiết lập loại RigidBody
                    rb.gravityScale = 10;
                }  // Thiết lập loại RigidBody
            } else if (countHold === 1) {
                if (!nodeLast || !nodeLastCbi) {
                    warn('Pivot or Pendulum nodes are not assigned!');
                    return;
                }

                log('nodeLastCbi: ', nodeLastCbi);
                log('nodeLast: ', nodeLast);
                log('this.cbiLast: ', this.cbiLast);

                // Thiết lập RigidBody2D cho nodeLastCbi (pivot)
                let pivotBody = this.cbiLast.getComponent(RigidBody2D);
                if (!pivotBody) {
                    pivotBody = nodeLastCbi.addComponent(RigidBody2D);
                }
                pivotBody.type = ERigidBody2DType.Static; // Đảm bảo pivot là tĩnh

                // Thiết lập RigidBody2D cho nodeLast (pendulum)
                let pendulumBody = nodeLast.getComponent(RigidBody2D);
                if (!pendulumBody) {
                    pendulumBody = nodeLast.addComponent(RigidBody2D);
                }
                pendulumBody.type = ERigidBody2DType.Dynamic; // Đảm bảo pendulum là động

                // Thiết lập HingeJoint2D cho nodeLast (pendulum)
                let hingeJoint = nodeLast.getComponent(HingeJoint2D);
                if (!hingeJoint) {
                    hingeJoint = nodeLast.addComponent(HingeJoint2D);
                }

                hingeJoint.anchor = v2(0, 0); // Đặt điểm neo tại đỉnh của pendulum
                hingeJoint.connectedAnchor = v2(0, 0); // Vị trí kết nối, tính từ trung tâm của pivot
                hingeJoint.connectedBody = pivotBody; // Kết nối với pivot

                // Tuỳ chỉnh các thuộc tính cho hành vi của con lắc
                hingeJoint.enableMotor = false; // Tắt motor để con lắc dao động tự do
            }
        });
    }

    distribution() { // phân chia mảng
        let listItem = Req.instance._item;

        listItem.forEach((element, index) => {
            let listChild = element.children;

            let countHold = 0;
            listChild.forEach((ele, i) => {
                let name = ele.name;
                let filName = name.replace(/[0-9-]/g, '');

                if (filName === 'hold') {
                    countHold++;
                }
            });

            // Sử dụng Set để lưu trữ các eParent đã gặp
            // const eParentSet = new Set<Node>();

            listChild.forEach((ele, i) => {
                let name = ele.name;
                let filName = name.replace(/[0-9-]/g, '');
                const eParent = ele.parent;

                if (filName === 'hold') {
                    if (countHold === 1) {
                        const isDuplicate = Req.instance._oneCbi.some(node => node.name === eParent.name);
                        if (!isDuplicate) {
                            Req.instance._oneCbi.push(eParent);
                        }
                    } else if (countHold > 1) {
                        // Kiểm tra xem tên của eParent đã có trong _otherCbi chưa
                        const isDuplicate = Req.instance._otherCbi.some(node => node.name === eParent.name);
                        if (!isDuplicate) {
                            Req.instance._otherCbi.push(eParent);
                        }
                    }
                }
            });
        });
    }

    cbiLast: Node = null;
    isNodeCovered(node: Node): boolean {
        let listHold = Req.instance._hold;
        let listCbi = Req.instance._cbi;
        let isCovered = false;
        let isCoveredOnce = false;

        for (const upperNode of listHold) {
            if (this.isOverlapping(node, upperNode)) {
                isCoveredOnce = true;
                continue;
            }
        }

        if (isCoveredOnce) {
            for (const middleNode of listCbi) {
                if (this.isOverlapping(node, middleNode)) {
                    isCovered = true;
                    this.cbiLast = middleNode;
                    continue;
                }
            }
        }
        return isCovered;
    }

    // Hàm so sánh xấp xỉ cho Vec3
    approximatelyEqual(v1: Vec3, v2: Vec3, epsilon: number = 1): boolean {
        return Math.abs(v1.x - v2.x) < epsilon &&
            Math.abs(v1.y - v2.y) < epsilon &&
            Math.abs(v1.z - v2.z) < epsilon;
    }

    isOverlapping(node1: Node, node2: Node): boolean {
        const rect1 = node1.getComponent(UITransform).getBoundingBoxToWorld();
        const rect2 = node2.getComponent(UITransform).getBoundingBoxToWorld();

        if (rect1.intersects(rect2)) {
            const pos1World = node1.getParent().getComponent(UITransform).convertToWorldSpaceAR(node1.position);
            const pos2World = node2.getParent().getComponent(UITransform).convertToWorldSpaceAR(node2.position);

            if (this.approximatelyEqual(pos1World, pos2World)) {
                return true;
            }
        }
        return false;
    }

    isNodeCoveredNonePosition(node: Node): boolean {
        let listHold = Req.instance._hold;
        let listCbi = Req.instance._cbi;
        let isCovered = false;
        let isCoveredOnce = false;

        for (const upperNode of listHold) {
            if (this.isOverlappingNoneposition(node, upperNode)) {
                isCoveredOnce = true;
                continue;
            }
        }

        if (isCoveredOnce) {
            for (const middleNode of listCbi) {
                if (this.isOverlappingNoneposition(node, middleNode)) {
                    isCovered = true;
                    continue;
                }
            }
        }
        return isCovered;
    }

    isOverlappingNoneposition(node1: Node, node2: Node) {
        const rect1 = node1.getComponent(UITransform).getBoundingBoxToWorld();
        const rect2 = node2.getComponent(UITransform).getBoundingBoxToWorld();
        return rect1.intersects(rect2);
    }
}

