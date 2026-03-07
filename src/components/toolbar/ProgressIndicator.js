import { useContext } from 'react'
import MainContext from '../../contexts/MainContext'

export default function ProgressIndicator() {
    const { inProgress } = useContext(MainContext);
    const inProgressText = ['완료', '고도 데이터 불러오는중..', '최신화중..'];

    const className = 'progress-indicator ' + (inProgress ? 'in-progress' : 'ready'); 

    return (
        <div className={className}>
            {inProgressText[inProgress]}
        </div>
    );
}