import React, { useState } from "react";
import { Box, TextField, Typography } from "@material-ui/core";
import "./style.css";
import { DataCalc } from "./constant";

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<boolean | null>(false);

  const handleInputChange = (event: any) => {
    if (event === "AC") {
      setExpression("");
    } else {
      setExpression((prevExpression) => {
        return prevExpression + event;
      });
    }
    setError(false);
    setResult(null);
  };

  const calculateResult = () => {
    try {
      const newExpression = expression?.replace(/[^-()\d/*+.]/g, "");
      const resultValue = evaluateExpression(newExpression);
      if (!resultValue) {
        setError(true);
      } else {
        setResult(evaluateExpression(newExpression));
        setError(false);
      }
    } catch (error) {
      setError(true);
      setResult(null);
    }
  };

  const evaluateExpression = (expr: string): number => {
    const tokens = expr.match(/[-+*/()]|\d*\.\d+|\d+|\.\d+/g) || [];

    const handleOperation = (
      operator: string,
      a: number,
      b: number
    ): number => {
      switch (operator) {
        case "+":
          return b + a;
        case "-":
          return b - a;
        case "*":
          return a * b;
        case "/":
          if (b === 0) {
            throw new Error("Division by zero");
          }
          return b / a;
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    };

    const applyOperators = (operators: string[]): number => {
      let values: number[] = [];
      let ops: string[] = [];

      operators.forEach((token) => {
        if (token === "(") {
          ops.push(token);
        } else if (token === ")") {
          while (ops.length > 0 && ops[ops.length - 1] !== "(") {
            values.push(
              handleOperation(
                ops.pop() as string,
                values.pop() as number,
                values.pop() as number
              )
            );
          }
          ops.pop();
        } else if (
          token === "+" ||
          token === "-" ||
          token === "*" ||
          token === "/"
        ) {
          while (
            ops.length > 0 &&
            precedence(ops[ops.length - 1]) >= precedence(token) &&
            ops[ops.length - 1] !== "("
          ) {
            values.push(
              handleOperation(
                ops.pop() as string,
                values.pop() as number,
                values.pop() as number
              )
            );
          }
          ops.push(token);
        } else {
          values.push(parseFloat(token));
        }
      });

      while (ops.length > 0) {
        values.push(
          handleOperation(
            ops.pop() as string,
            values.pop() as number,
            values.pop() as number
          )
        );
      }

      return values[0];
    };

    const precedence = (operator: string): number => {
      if (operator === "+" || operator === "-") {
        return 1;
      } else if (operator === "*" || operator === "/") {
        return 2;
      }
      return 0;
    };

    return applyOperators(tokens);
  };

  return (
    <>
      <Box className="cal-wrap">
        <TextField
          variant="outlined"
          value={expression}
          disabled
        />
        {DataCalc?.map((item: any) => {
          return (
            <Box
              className="number-wrap"
              onClick={() =>
                item?.value === "="
                  ? calculateResult()
                  : handleInputChange(item?.value)
              }
            >
              {item?.value}
            </Box>
          );
        })}
      </Box>
      <div className="mainwrapper">
        {result !== null && !error && (
          <Typography className="result-typo" variant="h6">
            Result: {result}
          </Typography>
        )}
        {error && (
          <Typography className="error-typo" variant="h4">
            Entered value is not a valid number/expression
          </Typography>
        )}
      </div>
    </>
  );
};

export default Calculator;
