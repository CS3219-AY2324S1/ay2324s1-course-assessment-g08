const { languageToIdMap } = require('../helper/languageToIdMap');
const { attachPrintReturnValue } = require('../helper/attachPrintTemplates');
const { submitBatch } = require('../helper/submitBatch');
const { getBatchResult } = require('../helper/getBatchResult');

const runAllTestCases = async (req, res, next) => {
    const { code, language, allInputs, allExpectedOutputs } = req.body;

    const submissions = [];
    
    for (let i = 0; i < allInputs.length; i += 1) {
        const input = allInputs[i];
        const inputValues = Object.values(input);

        let inputValuesStr = ""
        for (const value of inputValues) {
            if (Array.isArray(value)) {
                inputValuesStr += JSON.stringify(value);
            } else if (typeof value === 'string') {
                inputValuesStr += `"${value}"`;
            } else {
                inputValuesStr += value;
            }

            inputValuesStr += ","
        }

        inputValuesStr = inputValuesStr.substring(0, inputValuesStr.length - 1);
        
        let codeWithPrint = "";
        try {
            codeWithPrint = attachPrintReturnValue(language, code, inputValuesStr);
        } catch (e) {
            return res.status(400).json({
                status: 'Runtime Error',
                message: 'Missing method signature, or you have not made changes to the code'
            });
        }

        submissions.push({
            source_code: Buffer.from(codeWithPrint).toString('base64'),
            language_id: languageToIdMap[language]
        });
    }

    let results;
    try {
        const tokens = await submitBatch(submissions)
    
        results = await getBatchResult(tokens);
    } catch (error) {
        return res.status(500).json({
            status: "Internal Server Error",
            message: error
        })
    }

    const allTestCaseResults = []
    for (let i = 0; i < results.length; i += 1) {
        const result = results[i];

        console.log(result);
        
        if (result.status.description.startsWith('Runtime Error')) {
            return res.status(400).json({
                status: 'Runtime Error',
                message: Buffer.from(result.stderr, 'base64').toString('utf-8')
            })
        }
    
        if (result.status.description.startsWith('Time Limit Exceeded')) {
            return res.status(400).json({
                status: "Time Limit Exceeded",
                message: "Code took too long to run"
            });
        }
    
        if (result.status.description === 'Accepted') {
            result.stdout = Buffer.from(result.stdout, 'base64').toString('utf-8')
            let expectedOutput = allExpectedOutputs[i];
    
            if (Array.isArray(expectedOutput)) {
                expectedOutput = JSON.stringify(expectedOutput);
                result.stdout = result.stdout.replaceAll(" ", "");
            } else {
                expectedOutput = expectedOutput.toString();
            }
    
            if (result.stdout.trim() === expectedOutput) {
                allTestCaseResults.push({ status: 'Passed', message: result.stdout }); 
            } else {
                allTestCaseResults.push({ status: 'Failed', message: result.stdout });
            }
    
            continue;
        }

        return res.status(500).json({
            status: "something terrible happened. not supposed to reach here",
            message: result
        });
    }

    return res.status(200).json({
        status: "All test cases successfully executed",
        results: allTestCaseResults
    });
};

module.exports = {
    runAllTestCases
};