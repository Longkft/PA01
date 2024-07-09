import { _decorator, Component, Node, Input, log, tween, Vec3, UITransform, RigidBody2D, PolygonCollider2D, ERigidBody2DType, HingeJoint2D, Vec2, warn, v2 } from 'cc';
import { Req } from './Req';
import { Wood } from './Wood';
const { ccclass, property } = _decorator;

@ccclass('Hold')
export class Hold extends Component {

    cbiLast: Node = null; // Đảm bảo rằng cbiLast có kiểu là Node

    start() {
        this.registerTouch();
        this.distribution();
    }

    update(deltaTime: number) { }

    registerTouch() {
        this.node.on(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    destroyTouch() {
        this.node.off(Input.EventType.TOUCH_START, this.touchStart, this);
    }

    touchStart() {
        if (Req.instance._woodNode) {
            log('touchStart-hold');

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

    countHoldCbiLast: any = null;
    checkRigid() {
        let oneCbi = Req.instance._oneCbi;
        let otherCbi = Req.instance._otherCbi;

        oneCbi.forEach(element => {
            let listChild = element.children;
            listChild.forEach(ele => {
                let name = ele.name;
                let fildName = name.replace(/[0-9-]/g, '');
                if (fildName === 'hold' && !this.isNodeCovered(ele)) {
                    let rb = ele.parent.getComponent(RigidBody2D);
                    if (!rb) {
                        rb = ele.parent.addComponent(RigidBody2D);
                    }
                    const force = new Vec2(0, -1000); // Tăng giá trị Y để tăng lực rơi
                    rb.applyForceToCenter(force, true);
                    rb.type = ERigidBody2DType.Dynamic;
                    rb.gravityScale = 10;
                }
            });
        });

        otherCbi.forEach(element => {
            let listChild = element.children;
            let countHold = 0;
            let nodeLastCbi = null;
            let nodeLast = null;

            listChild.forEach(ele => {
                let name = ele.name;
                let filName = name.replace(/[0-9-]/g, '');
                if (filName === 'hold') {
                    if (!this.isNodeCovered(ele)) {
                        log(false);
                    } else {
                        countHold++;
                        Req.instance._countHold = countHold;
                        nodeLastCbi = ele;
                        nodeLast = element;
                        log(true);
                    }
                }
            });
            log('countHold: ', countHold)
            log('Req.instance._countHold: ', Req.instance._countHold)
            let d_count = Req.instance._countHold;
            if (countHold === 0) {
                if (Req.instance._countHoldCbiLast) {
                    log(1234567789754764)
                    this.removeCpHing(Req.instance._countHoldCbiLast);
                } else {
                    log('none0: ');
                }

                const rb = element.getComponent(RigidBody2D);
                if (rb) {
                    const force = new Vec2(0, -1000); // Tăng giá trị Y để tăng lực rơi
                    rb.applyForceToCenter(force, true);
                    rb.type = ERigidBody2DType.Dynamic;
                    rb.gravityScale = 10;
                }
            } else if (countHold === 1) {
                if (!nodeLast || !this.cbiLast) {
                    warn('Pivot hoặc Pendulum nodes không được gán!');
                    return;
                }

                Req.instance._countHoldCbiLast = this.cbiLast;

                // Thiết lập RigidBody2D cho nodeLastCbi (pivot)
                let pivotBody = this.cbiLast.getComponent(RigidBody2D);
                if (!pivotBody) {
                    pivotBody = this.cbiLast.addComponent(RigidBody2D);
                }
                pivotBody.type = ERigidBody2DType.Static;

                // Thiết lập RigidBody2D cho nodeLast (pendulum)
                let pendulumBody = nodeLast.getComponent(RigidBody2D);
                if (!pendulumBody) {
                    pendulumBody = nodeLast.addComponent(RigidBody2D);
                }
                pendulumBody.type = ERigidBody2DType.Dynamic;
                let posNodeLast = nodeLastCbi.position;

                // Thiết lập HingeJoint2D cho nodeLast (pendulum)
                let hingeJoint = this.cbiLast.getComponent(HingeJoint2D);
                if (!hingeJoint) {
                    hingeJoint = this.cbiLast.addComponent(HingeJoint2D);
                }

                // Kiểm tra chồng lấp
                const anchorBounds = this.cbiLast.getComponent(UITransform).getBoundingBoxToWorld();
                const nodeLastBounds = nodeLast.getComponent(UITransform).getBoundingBoxToWorld();

                if (anchorBounds.intersects(nodeLastBounds)) {
                    hingeJoint.anchor = v2(0, 0);
                    hingeJoint.connectedAnchor = v2(posNodeLast.x * 2, posNodeLast.y * 2);
                    hingeJoint.connectedBody = pendulumBody;
                    hingeJoint.enableMotor = false;
                    // hingeJoint.maxMotorTorque = 1000;
                    // hingeJoint.motorSpeed = 180;

                    // Đảm bảo khớp được tạo đúng cách
                    if (!hingeJoint.connectedBody) {
                        warn('HingeJoint2D không kết nối với Pivot');
                    } else {
                        log('HingeJoint2D được kết nối thành công');
                    }
                } else {
                    log('Anchor không chồng lấp với Pendulum');
                }
            }
        });
    }

    removeCpHing(node: Node) {
        const hingNode = node.getComponent(HingeJoint2D);
        if (hingNode) {
            hingNode.connectedBody = null;
            hingNode.destroy();
            log(node)
        }
    }

    distribution() {
        let listItem = Req.instance._item;

        listItem.forEach(element => {
            let listChild = element.children;
            let countHold = 0;

            listChild.forEach(ele => {
                let name = ele.name;
                let filName = name.replace(/[0-9-]/g, '');
                if (filName === 'hold') {
                    countHold++;
                }
            });

            listChild.forEach(ele => {
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
                        const isDuplicate = Req.instance._otherCbi.some(node => node.name === eParent.name);
                        if (!isDuplicate) {
                            Req.instance._otherCbi.push(eParent);
                        }
                    }
                }
            });
        });
    }

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

    approximatelyEqual(v1: Vec3, v2: Vec3, epsilon: number = 10): boolean {
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
}
