import * as rules from './onboarding.module.css';
import Container from 'react-bootstrap/Container';

export default function One({ children }) {
    return (
        <Container className={rules.container}>
            {children}
        </Container>
    )
}
