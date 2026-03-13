import { LabelHTMLAttributes } from 'react';

export default function InputLabel({
    value,
    className = '',
    children,
    isRequired = false,
    ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { value?: string, isRequired?: boolean }) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-medium text-gray-700 ` +
                className
            }
        >
            {value ? value : children}
            {isRequired && <span className="text-rose-500 ml-1">*</span>}
        </label>
    );
}
