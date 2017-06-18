/**
 * Created by hasee on 2017/6/17.
 */
$(function () {

    var inputMoneyTemplate = '<p class="form-inline"> <input type="text" class="form-control index-text-input" placeholder="name"> <input type="text" class="form-control index-text-input" placeholder="weight(default value:1)"> </p>';
    var payTableTemplateHeader = '<table class="table table-striped table-bordered table-hover text-center"><thead><tr><th>name</th><th>needpay</th></tr></thead><tbody>';
    var payTableTemplateFooter = '</tbody></table>';
    var calculateFlag = true;

    /**
     * 增加一个记录行
     */
    $("#indexAdd").click(function () {
        $("#inputArea").append(inputMoneyTemplate);
    });

    /**
     * 计算每个人要付多少钱
     */
    $("#indexCalculate").click(function () {
        calculate();
    });

    /**
     * 计算
     */
    function calculate() {
        var totalMoney = $('#totalMoney').val();
        if(totalMoney == ""){
            alert("请输入总支出！");
            calculateFlag = false;
        }
        var nameWight = getNameWeight();
        if(calculateFlag == true){
            var everyPayArary = getEveryNeedPay(totalMoney, nameWight.nameArray, nameWight.weightArray);
            createPayTable(everyPayArary);
        }
    }

    /**
     * 生成统计表
     * @param everyPayArary
     */
    function createPayTable(everyPayArary) {
        var payTableTemplateBody = "";
        for(var i=0; i<everyPayArary.length; i++){
            payTableTemplateBody += '<tr> <td>';
            payTableTemplateBody += (everyPayArary[i].name + '</td>');
            payTableTemplateBody += '<td>';
            payTableTemplateBody += (everyPayArary[i].pay + '</td></td>');
        }
        $('#payTable').html(payTableTemplateHeader+payTableTemplateBody+payTableTemplateFooter);
    }

    /**
     * 获取名字和权重
     * @returns {Object}
     */
    function getNameWeight() {
        var nameWeight = new Object();
        var i = 0;
        var nameArray = new Array();
        var weightArray = new Array();
        var nameIndex = 0;
        var weightIndex = 0;
        $("#inputArea p input").each(function () {
            if (i % 2 == 0) {
                var name = $(this).val();
                if(name == ""){
                    calculateFlag = false;
                    alert("请输入名字！");
                }
                nameArray[nameIndex++] = name;
            } else {
                var weight = $(this).val();
                if (weight == "") {
                    weight = 1;
                }
                weightArray[weightIndex++] = weight;
            }
            i++
        });
        nameWeight.nameArray = nameArray;
        nameWeight.weightArray = weightArray;
        return nameWeight;
    }

    /**
     * 获取每个人要付多少钱
     * @param totalMoney
     * @param nameArray
     * @param weightArray
     * @returns {{}}
     */
    function getEveryNeedPay(totalMoney, nameArray, weightArray) {
        var totalWeight = getArrayTotal(weightArray);
        var everyPayArary = new Array();
        console.log("nameArray.length:" + nameArray.length);
        for (var i = 0; i < nameArray.length; i++) {
            var everyPayObj = new Object();
            everyPayObj.name = nameArray[i];
            everyPayObj.pay = numMulti(totalMoney, numDiv(weightArray[i], totalWeight));
            everyPayArary[i] = everyPayObj;
        }
        return everyPayArary;
    }

    /**
     * 数组值求和
     * @param array 数组
     * @returns {number} 和
     */
    function getArrayTotal(array) {
        var arrayTotal = parseFloat(0);
        for (var i = 0; i < array.length; i++) {
            arrayTotal += parseFloat(array[i]);
        }
        return arrayTotal;
    }

    /**
     * 四舍五入运算
     * @param num 数值
     * @param len 保留到小数点后 len 位
     */
    function getRound(num, len) {
        if (num.toString().split(".").length > 1) {
            var decimal = num.toString().split(".")[1];
            var result = num.toString().split(".")[0];
            if (decimal.length <= len) {
                return num;
            } else {
                if (decimal.toString()[len] >= 5) {
                    var newDecimal = copyStrLen(decimal.toString(), len - 1);
                    newDecimal += (parseInt(decimal.toString()[len - 1]) + 1);
                    result += ".";
                    result += (intPointMoveLeft(newDecimal, len).toString().split(".")[1]);
                    console.log("五入");
                } else {
                    var newDecimal = copyStrLen(decimal.toString(), len);
                    result += ".";
                    result += (intPointMoveLeft(newDecimal, len).toString().split(".")[1]);
                    console.log("四舍");
                }
            }
            return result;
        }
        return num;
    }

    /**
     * 整型小数点左移
     * @param num 原数整型值
     * @param moveStep 小数点左移位数
     * @returns {*}
     */
    function intPointMoveLeft(num, moveStep) {
        var resultNum = "0.";
        var numStr = num.toString();
        for (var i = 0; i < moveStep; i++) {
            resultNum += num[i];
        }
        return resultNum;
    }

    /**
     * 拷贝字符串的前 len 位
     * @param str 被拷贝字符
     * @param len 需要拷贝的长度
     * @returns {string}
     */
    function copyStrLen(str, len) {
        var resultStr = "";
        for (var i = 0; i < len; i++) {
            resultStr += str[i];
        }
        return resultStr;
    }

    /**
     * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
     *
     * @param num1被除数 | num2除数
     */
    function numDiv(num1, num2) {
        var baseNum1 = 0, baseNum2 = 0;
        var baseNum3, baseNum4;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        with (Math) {
            baseNum3 = Number(num1.toString().replace(".", ""));
            baseNum4 = Number(num2.toString().replace(".", ""));
            return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
        }
    }

    /**
     * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
     *
     * @param num1加数1 | num2加数2
     */
    function numAdd(num1, num2) {
        var baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    }

    /**
     * 加法运算，避免数据相减小数点后产生多位数和计算精度损失。
     *
     * @param num1被减数  |  num2减数
     */
    function numSub(num1, num2) {
        var baseNum, baseNum1, baseNum2;
        var precision;// 精度
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
        return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
    };
    /**
     * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
     *
     * @param num1被乘数 | num2乘数
     */
    function numMulti(num1, num2) {
        var baseNum = 0;
        try {
            baseNum += num1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            baseNum += num2.toString().split(".")[1].length;
        } catch (e) {
        }
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
    };

});