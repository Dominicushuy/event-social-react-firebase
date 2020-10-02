import React from 'react';
import {
  Segment,
  Image,
  Item,
  Header,
  Button,
  Confirm,
} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  addUserAttendance,
  cancelUserAttendance,
} from '../../../app/firestore/firestoreService';
import { useSelector } from 'react-redux';
import UnauthModal from '../../auth/UnauthModal';

const eventImageStyle = {
  filter: 'brightness(30%)',
};

const eventImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white',
};

function EventDetailedHeader({ event, isHost, isGoing, history }) {
  const [loading, setLoading] = useState(false);
  const { authenticated } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  const { currentUserProfile } = useSelector((state) => state.profile);
  const [confirmOpenUpdateAvatar, setConfirmOpenUpdateAvatar] = useState(false);

  async function handleUserJoinEvent() {
    if (!currentUserProfile.photoURL) {
      setConfirmOpenUpdateAvatar(true);
    } else {
      setLoading(true);
      try {
        await addUserAttendance(event);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleUserLeaveEvent() {
    setLoading(true);
    try {
      await cancelUserAttendance(event);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {modalOpen && <UnauthModal setModalOpen={setModalOpen} />}
      <Segment.Group>
        <Segment basic attached='top' style={{ padding: '0' }}>
          <Image
            src={`/assets/categoryImages/${event.category}.jpg`}
            fluid
            style={eventImageStyle}
          />

          <Segment basic style={eventImageTextStyle}>
            <Item.Group>
              <Item>
                <Item.Content>
                  <Header
                    size='huge'
                    content={event.title}
                    style={{ color: 'white' }}
                  />
                  <p>{format(event.date, 'MMMM d, yyyy h:mm a')}</p>
                  <p>
                    Hosted by{' '}
                    <strong>
                      <Link to={`/profile/${event.hostUid}`}>
                        {event.hostedBy}
                      </Link>{' '}
                    </strong>
                  </p>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>

        <Segment attached='bottom' clearing>
          {!isHost && (
            <>
              {isGoing ? (
                <Button onClick={handleUserLeaveEvent} loading={loading}>
                  Cancel My Place
                </Button>
              ) : (
                <Button
                  onClick={
                    authenticated
                      ? handleUserJoinEvent
                      : () => setModalOpen(true)
                  }
                  loading={loading}
                  color='teal'
                >
                  JOIN THIS EVENT
                </Button>
              )}
            </>
          )}

          {isHost && (
            <Button
              as={Link}
              to={`/manage/${event.id}`}
              color='orange'
              floated='right'
            >
              Manage Event
            </Button>
          )}
        </Segment>
        <Confirm
          content='You must update avatar before join event !!!'
          open={confirmOpenUpdateAvatar}
          onCancel={() => history.push('/events')}
          onConfirm={() => {
            setConfirmOpenUpdateAvatar(false);
            history.push(`/profile/${currentUserProfile.id}`);
          }}
        />
      </Segment.Group>
    </>
  );
}

export default withRouter(EventDetailedHeader);
