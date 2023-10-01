import * as rules from './onboarding.module.css';
import Container from 'react-bootstrap/Container';

export default function One({ children }) {
    return (
        <div className={rules.container}>
            {children}
            <hr />
        </div>
    )
}
