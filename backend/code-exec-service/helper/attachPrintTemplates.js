const attachPythonPrintReturnValue = (pythonCode, inputArgs) => {
    const classMethodSignature = /^class [a-zA-Z_]\w*\(object\):\n\s*def [a-zA-Z_]\w*\(self, [^)]*\):\n/;
    const standaloneFunctionSignature = /^def [a-zA-Z_]\w*\([^)]*\):\n/;

    if (classMethodSignature.test(pythonCode)) {
        const methodNameMatch = pythonCode.match(/^class [a-zA-Z_]\w*\(object\):\n\s*def ([a-zA-Z_]\w*)\(self, [^)]*\):/);
        if (!methodNameMatch) {
            throw new Error("Failed to extract method name");
        }

        const methodName = methodNameMatch[1];

        console.log(pythonCode + '\n' + `solution = Solution()\nprint(solution.${methodName}(${inputArgs}))`);

        return pythonCode + '\n' + `solution = Solution()\nprint(solution.${methodName}(${inputArgs}))`;
    } else if (standaloneFunctionSignature.test(pythonCode)) {
        const methodNameMatch = pythonCode.match(/^def ([a-zA-Z_]\w*)\([^)]*\):/);
        if (!methodNameMatch) {
            throw new Error("Failed to extract function name");
        }

        const methodName = methodNameMatch[1];

        console.log(pythonCode + '\n' + `print(${methodName}(${inputArgs}))`);

        return pythonCode + '\n' + `print(${methodName}(${inputArgs}))`;
    } else {
        throw new Error("Missing Method Signature, or you have not made any changes to the code");
    }
};

const attachJsPrintReturnValue = (jsCode, inputArgs) => {
    const functionSignatureWithComment = /\/\*\*[^]*?@return\s+\{(\w+)\}\s*(var\s+)?([a-zA-Z_]\w*)\s*=\s*function\([^)]*\)\s*{|\/\*\*[^]*?@return\s+\{(\w+)\}\s*function\s+([a-zA-Z_]\w*)\s*\([^)]*\)\s*{/;

    const matchWithComment = jsCode.match(functionSignatureWithComment);

    if (!matchWithComment) {
        const functionSignatureWithoutComment = /(var\s+)?([a-zA-Z_]\w*)\s*=\s*function\([^)]*\)\s*{|function\s+([a-zA-Z_]\w*)\s*\([^)]*\)\s*{/;
        const matchWithoutComment = jsCode.match(functionSignatureWithoutComment);

        if (!matchWithoutComment) {
            throw new Error("Missing or incorrectly formatted function signature");
        }

        const methodName = matchWithoutComment[2] || matchWithoutComment[3];
        const returnValue = `${methodName}(${inputArgs})`;

        console.log(jsCode + '\n' + `console.log(${returnValue});`);

        return jsCode + '\n' + `console.log(${returnValue});`;
    }

    const returnType = matchWithComment[1] || matchWithComment[4];
    const methodName = matchWithComment[3] || matchWithComment[5];
    const returnValue = `${methodName}(${inputArgs})`;

    console.log(jsCode + '\n' + `console.log(${returnValue});`);

    return jsCode + '\n' + `console.log(${returnValue});`;
};

const attachRubyPrintReturnValue = (rubyCode, inputArgs) => {
    const methodSignature = /# @param {[^]*?@return {[^]*?}\s*def [a-zA-Z_]\w*\([^)]*\)\s*\n/;

    const match = rubyCode.match(methodSignature);

    if (!match) {
        const methodSignatureWithoutComment = /def [a-zA-Z_]\w*\([^)]*\)\s*\n/;
        const matchWithoutComment = rubyCode.match(methodSignatureWithoutComment);

        if (!matchWithoutComment) {
            throw new Error("Missing or incorrectly formatted method signature");
        }

        const methodNameMatch = rubyCode.match(/def ([a-zA-Z_]\w*)\([^)]*\)/);
        if (!methodNameMatch) {
            throw new Error("Failed to extract method name");
        }

        const methodName = methodNameMatch[1];

        return rubyCode + '\n' + `puts ${methodName}(${inputArgs})`;
    }

    const methodNameMatch = rubyCode.match(/def ([a-zA-Z_]\w*)\([^)]*\)/);
    if (!methodNameMatch) {
        throw new Error("Failed to extract method name");
    }

    const methodName = methodNameMatch[1];

    return rubyCode + '\n' + `puts ${methodName}(${inputArgs})`;
};

const attachPrintReturnValue = (language, code, inputArgs) => {
    return language === 'python'
        ? attachPythonPrintReturnValue(code, inputArgs)
        : language === 'javascript'
        ? attachJsPrintReturnValue(code, inputArgs)
        : language === 'text/x-ruby'
        ? attachRubyPrintReturnValue(code, inputArgs)
        : null;
};

module.exports = {
    attachPrintReturnValue
};