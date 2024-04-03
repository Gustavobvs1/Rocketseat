package rocketseat.com.passin.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rocketseat.com.passin.domain.attendee.Attendee;
import rocketseat.com.passin.domain.checkin.CheckIn;
import rocketseat.com.passin.domain.checkin.exceptions.CheckedInAlreadyExistsException;
import rocketseat.com.passin.repositories.CheckInRepository;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class CheckInService {

    private final CheckInRepository checkInRepository;

    public void registerCheckin(Attendee attendee){
        this.verifyCheckInExists(attendee.getId());
        CheckIn newCheckin = new CheckIn();
        newCheckin.setAttendee(attendee);
        newCheckin.setCreatedAt(LocalDateTime.now());
        this.checkInRepository.save(newCheckin);
    }

    public Optional<CheckIn> getCheckIn(String attendeeId){
        return this.checkInRepository.findByAttendeeId(attendeeId);
    }

    private void verifyCheckInExists(String attendeeId){
        Optional<CheckIn> isCheckedIn = getCheckIn(attendeeId);
        if(isCheckedIn.isPresent()) throw new CheckedInAlreadyExistsException("Atteendee Already checkedIn");
    }
}
